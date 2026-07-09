import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import paymentService from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import config from "../../config";

const initiatePayment = catchAsync(async (req: Request, res: Response) => {
    const { requestId } = req.body;
    const user = req.user;
    if (!requestId) {
        throw new Error("Please provide requestId in body");
    }
    const { gatewayPageURL, transactionId } =
        await paymentService.initiatePayment(requestId, user);

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Payment gatewayPageURL Retrived successfully",
        data: { gatewayPageURL, transactionId },
    });
});

const verifyPayment = catchAsync(async (req: Request, res: Response) => {
    const { requestId, trxId } = req.query;
    if (!requestId || !trxId) {
        throw new Error("Missing payment information.");
    }
    const payload = req.body;

    const result = await paymentService.verifyPayment(
        requestId as string,
        trxId as string,
        payload,
    );

    if (result.success) {
        return res.redirect(
            `${config.client_url}/payment/success?requestId=${requestId}&trxId=${trxId}`,
        );
    }

    return res.redirect(
        `${config.client_url}/payment/failed?requestId=${requestId}`,
    );
});

const getTenantPayments = catchAsync(async (req: Request, res: Response) => {
    const tenantId = req.user.id;
    const result = await paymentService.getTenantPayments(tenantId);

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Tenant's payment history retrived successfully",
        data: result,
    });
});

const getPaymentsDetails = catchAsync(async (req: Request, res: Response) => {
    const trxId = req.params.id;
    const tenantId = req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    if (!trxId) {
        throw new Error("TransactionId required in params");
    }

    const result = await paymentService.getPaymentDetails(
        trxId as string,
        tenantId,
        isAdmin,
    );

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Payment details Retrived  successfully",
        data: result,
    });
});

export const paymentCotroller = {
    initiatePayment,
    verifyPayment,
    getTenantPayments,
    getPaymentsDetails,
};
