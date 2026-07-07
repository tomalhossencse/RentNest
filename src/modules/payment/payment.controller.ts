import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import paymentService from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus, { status } from "http-status";
import config from "../../config";

const initiatePayment = catchAsync(async (req: Request, res: Response) => {
    const { requestId } = req.body;
    const user = req.user;
    if (!requestId) {
        throw new Error("Please provide requestId in body");
    }
    const gatewayPageURL = await paymentService.initiatePayment(
        requestId,
        user,
    );

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Payment gatewayPageURL Retrived successfully",
        data: { gatewayPageURL },
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
            `${config.client_url}/payment/success?requestId=${requestId}`,
        );
    }

    return res.redirect(
        `${config.client_url}/payment/failed?requestId=${requestId}`,
    );
});

export const paymentCotroller = {
    initiatePayment,
    verifyPayment,
};
