import { ICreateRequest } from "../../types";
import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import requestService from "./request.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createRequest = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const tenantId = req.user.id;

    const { moveInDate, propertyId } = payload as ICreateRequest;

    if (!moveInDate || !propertyId) {
        throw new Error("Please enter moveInDate and propertyId");
    }

    const result = await requestService.createRequest(tenantId, payload);

    sendResponse(res, {
        success: true,
        status: httpStatus.CREATED,
        message: "Rental request created  successfully",
        data: result,
    });
});
export const requestController = {
    createRequest,
};
