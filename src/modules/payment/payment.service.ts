import axios from "axios";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { JwtPayload } from "../../types";
import { failedStatus, SSLCommerzInitPayload } from "./payment.interface";

class Payment {
    async initiatePayment(requestId: string, tenant: JwtPayload) {
        const existingPayment = await prisma.payment.findUnique({
            where: {
                requestId,
            },
        });

        if (existingPayment) {
            throw new Error("A payment already exists for this request.");
        }

        const request = await prisma.request.findUnique({
            where: {
                id: requestId,
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
            throw new Error("Request not found.");
        }

        if (request.status !== "APPROVED") {
            throw new Error("Request is not approved.");
        }

        if (request.property.status !== "AVAILABLE") {
            throw new Error("Property is not available.");
        }

        if (request.tenantId !== tenant.id) {
            throw new Error("You are not authorized to pay for this request.");
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

        if (!gatewayPageURL) {
            throw new Error("Failed to initialize SSLCommerz payment.");
        }

        await prisma.payment.create({
            data: {
                amount: request.property.monthlyRent,
                requestId,
                userId: tenant.id,
                transactionId: trxId,
                meta: {
                    sessionKey: data.sessionkey,
                    gatewayPageURL: gatewayPageURL,
                },
            },
        });

        return {
            gatewayPageURL,
            transactionId: trxId,
        };
    }

    async verifyPayment(requestId: string, trxId: string, payload: any) {
        const payment = await prisma.payment.findUnique({
            where: {
                transactionId: trxId,
            },
            include: {
                request: {
                    include: {
                        property: true,
                    },
                },
            },
        });
        if (!payment) {
            throw new Error("Payment not found.");
        }

        if (payment.requestId !== requestId) {
            throw new Error("Payment does not belong to this request.");
        }

        if (payment.status === "COMPLETED") {
            return {
                success: true,
            };
        }
        const response = await axios.get(
            `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${payload.val_id}&store_id=${config.ssl_ecomerz_store_id}&store_passwd=${config.ssl_ecomerz_store_password}&format=json`,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        );

        const data = response.data;

        if (
            data.status === "VALID" &&
            data.tran_id === payment.transactionId &&
            Number(data.amount) === Number(payment.amount)
        ) {
            await prisma.$transaction(async (tx) => {
                const result = await tx.property.updateMany({
                    where: {
                        id: payment.request.propertyId,
                        status: "AVAILABLE",
                    },
                    data: {
                        status: "RENTED",
                    },
                });

                if (result.count === 0) {
                    throw new Error("Property already rented.");
                }

                await tx.payment.update({
                    where: {
                        transactionId: trxId,
                    },
                    data: {
                        status: "COMPLETED",
                        paidAt: new Date(data.tran_date),
                        method: data.card_type,
                        meta: data,
                    },
                });
                await tx.request.update({
                    where: {
                        id: requestId,
                    },
                    data: {
                        status: "PAID",
                    },
                });

                await tx.rental.create({
                    data: {
                        requestId: requestId,
                        tenantId: payment.request.tenantId,
                        monthlyRent: payment.request.property.monthlyRent,
                        startDate: payment.request.moveInDate,
                    },
                });
            });

            return {
                success: true,
            };
        } else if (failedStatus.includes(data.status)) {
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

    async getTenantPayments(tenantId: string) {
        const result = await prisma.payment.findMany({
            where: {
                request: {
                    tenantId,
                },
            },
        });
        return result;
    }

    async getPaymentDetails(trxId: string, tenantId: string, isAdmin: boolean) {
        const paymentDetails = await prisma.payment.findUnique({
            where: {
                transactionId: trxId,
            },
            include: {
                request: true,
            },
        });

        if (!isAdmin && paymentDetails?.userId !== tenantId) {
            throw new Error(
                "You are not authorized  for this payment details.",
            );
        }
        if (!paymentDetails) {
            throw new Error("This payment is not Exits");
        }

        return paymentDetails;
    }
}

export default new Payment();
