import axios from "axios";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { failedStatuses, JwtPayload } from "../../types";
import { SSLCommerzInitPayload } from "./payment.interface";

class Payment {
    async initiatePayment(requestId: string, tenant: JwtPayload) {
        const existingPayment = await prisma.payment.findFirst({
            where: {
                requestId,
                status: {
                    in: ["PENDING", "COMPLETED"],
                },
            },
        });

        if (existingPayment) {
            throw new Error("A payment already exists for this request.");
        }

        const request = await prisma.request.findFirst({
            where: {
                id: requestId,
                status: "APPROVED",
            },
            include: {
                property: {
                    include: {
                        category: true,
                    },
                },
            },
        });

        if (!request) {
            throw new Error("Please enter approved requestId");
        }

        const trxId = `REQ-${request.id.slice(0, 8)}-${Date.now()}`;

        const paymentData: SSLCommerzInitPayload = {
            store_id: config.ssl_ecomerz_store_id,
            store_passwd: config.ssl_ecomerz_store_password,
            total_amount: request.property.monthlyRent,
            currency: "BDT",
            tran_id: trxId,
            success_url: `${config.app_url}/api/payments/confirm?requestId=${request.id}&trxId=${trxId}&status=success`,
            fail_url: `${config.app_url}/api/payments/confirm?requestId=${request.id}&trxId=${trxId}&status=fail`,
            cancel_url: `${config.app_url}/api/payments/confirm?requestId=${request.id}&trxId=${trxId}&status=cancel`,
            cus_name: tenant.name,
            cus_email: tenant.email,
            cus_add1: "N/A",
            cus_city: "N/A",
            cus_state: "N/A",
            cus_postcode: 1000,
            cus_country: "Bangladesh",
            cus_phone: "01711111111",
            cus_fax: "01711111111",
            product_name: request.property?.title,
            product_category: request.property.category.name,
            product_profile: "general",
        };

        const response = await axios.post(
            "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
            paymentData,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        );

        const data = response.data;
        const gatewayPageURL = data.GatewayPageURL;

        await prisma.payment.create({
            data: {
                amount: request.property.monthlyRent,
                requestId,
                transactionId: trxId,
            },
        });

        return gatewayPageURL;
    }

    async verifyPayment(requestId: string, trxId: string, payload: any) {
        const response = await axios.get(
            `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${payload.val_id}&store_id=${config.ssl_ecomerz_store_id}&store_passwd=${config.ssl_ecomerz_store_password}&format=json`,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        );

        const data = response.data;

        const payment = await prisma.payment.findUniqueOrThrow({
            where: {
                transactionId: trxId,
            },
        });

        // console.log({ data });
        if (
            data.status === "VALID" &&
            data.tran_id === payment.transactionId &&
            Number(data.amount) === payment.amount
        ) {
            await prisma.$transaction(async (tx) => {
                await tx.request.update({
                    where: {
                        id: requestId,
                    },
                    data: {
                        status: "PAID",
                        property: {
                            update: {
                                status: "RENTED",
                            },
                        },
                    },
                });

                await tx.payment.update({
                    where: {
                        transactionId: trxId,
                    },
                    data: {
                        status: "COMPLETED",
                        paidAt: new Date(),
                        method: data.card_type,
                        meta: data,
                    },
                });
            });

            return {
                success: true,
            };
        } else if (failedStatuses.includes(data.status)) {
            await prisma.$transaction(async (tx) => {
                await tx.request.update({
                    where: {
                        id: requestId,
                    },
                    data: {
                        status: "CANCELLED",
                    },
                });

                await tx.payment.update({
                    where: {
                        transactionId: trxId,
                    },
                    data: {
                        status: "FAILED",
                        method: data.card_type,
                        meta: data,
                    },
                });
            });

            return {
                success: false,
            };
        } else {
            throw new Error("Payment verification failed.");
        }
    }
}

export default new Payment();
