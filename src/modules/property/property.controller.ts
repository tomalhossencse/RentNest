import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import httpStatus from "http-status";
import propertyService from "./property.service";
import { ICreatePropery } from "../../types";
import { sendResponse } from "../../utils/sendResponse";

const addProperty = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const {
        title,
        address,
        availableFrom,
        categoryId,
        district,
        division,
        floor,
        monthlyRent,
        status,
    } = payload as ICreatePropery;

    if (
        !title ||
        !address ||
        !availableFrom ||
        !categoryId ||
        !district ||
        !division ||
        !floor ||
        !monthlyRent ||
        !status
    ) {
        throw new Error("All fields are required");
    }

    const landlordId = req.user.id;

    const result = await propertyService.addProperty(payload, landlordId);

    sendResponse(res, {
        success: true,
        status: httpStatus.CREATED,
        message: "New Property Added successfully",
        data: result,
    });
});

const getAllPropery = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;

    const { data, meta } = await propertyService.getAllProperty(query);

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Properties Retrived  successfully",
        data,
        meta,
    });
});

const getProperyDetails = catchAsync(async (req: Request, res: Response) => {
    const propertyId = req.params.id;
    if (!propertyId) {
        throw new Error("propertyId is Required in params");
    }
    const result = await propertyService.getPropertyDetails(
        propertyId as string,
    );

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Property Retrived  successfully",
        data: result,
    });
});

const updateProperty = catchAsync(async (req: Request, res: Response) => {
    const updatedpayload = req.body;
    const propertyId = req.params.id;
    const landlordId = req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    if (!updatedpayload || !propertyId) {
        throw new Error(
            "Please enter update docs in body and propetyId in params",
        );
    }

    const result = await propertyService.updateProperty(
        propertyId as string,
        landlordId,
        isAdmin,
        updatedpayload,
    );

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Property updated  successfully",
        data: result,
    });
});
const deleteProperty = catchAsync(async (req: Request, res: Response) => {
    const propertyId = req.params.id;
    const landlordId = req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    if (!propertyId) {
        throw new Error("Please enter the propetyId in params");
    }

    const result = await propertyService.deleteProperty(
        propertyId as string,
        landlordId,
        isAdmin,
    );

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Property deleted  successfully",
        data: result,
    });
});

export const propertyController = {
    addProperty,
    getAllPropery,
    getProperyDetails,
    updateProperty,
    deleteProperty,
};
