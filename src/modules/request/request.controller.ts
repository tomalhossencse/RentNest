import { ICreateRequest, IUpdateRequestStaus } from "../../types";
import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import requestService from "./request.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createRequest = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    if (!payload) {
        throw new Error("Please provide payload!");
    }
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

const getRequestforLandLord = catchAsync(
    async (req: Request, res: Response) => {
        const landlordId = req.user.id;
        const result = await requestService.getRequestforLandLord(landlordId);
        sendResponse(res, {
            success: true,
            status: httpStatus.OK,
            message:
                "Rental request for landlord Properties Retrived  successfully",
            data: result,
        });
    },
);

const updateRequestStatus = catchAsync(async (req: Request, res: Response) => {
    const requestId = req.params.id;
    const landlordId = req.user.id;
    const payload = req.body;

    if (!payload) {
        throw new Error("Please provide payload!");
    }

    const { status } = payload as IUpdateRequestStaus;

    if (!requestId || !status) {
        throw new Error("Please provide requestId and status");
    }

    if (status !== "APPROVED" && status !== "REJECTED") {
        throw new Error("Please provide status (APPROVED / REJECTED)");
    }

    const result = await requestService.updateRequestStatus(
        requestId as string,
        landlordId,
        status,
    );
    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Rental request status updated successfully",
        data: result,
    });
});

const getRequestDetails = catchAsync(async (req: Request, res: Response) => {
    const requestId = req.params.id;
    const userId = req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    if (!requestId) {
        throw new Error("requestId is Required in params");
    }

    const result = await requestService.getRequestDetails(
        requestId as string,
        userId,
        isAdmin,
    );

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Rental request details retrived successfully",
        data: result,
    });
});

const getRequestForTenant = catchAsync(async (req: Request, res: Response) => {
    const tenantId = req.user.id;
    const result = await requestService.getRequestforTenant(tenantId);
    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Tenent Rental request Retrived successfully",
        data: result,
    });
});

const getAllRequestForAdmin = catchAsync(
    async (req: Request, res: Response) => {
        const query = req.query;
        const result = await requestService.getAllRequestforAdmin(query);
        sendResponse(res, {
            success: true,
            status: httpStatus.OK,
            message: "All Rental request Retrived successfully",
            data: result,
        });
    },
);

export const requestController = {
    createRequest,
    getRequestforLandLord,
    updateRequestStatus,
    getRequestDetails,
    getRequestForTenant,
    getAllRequestForAdmin,
};
