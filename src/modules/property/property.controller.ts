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

    const { data, meta } = await propertyService.getALlProperty(query);

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Properties Retrived  successfully",
        data,
        meta,
    });
});

export const propertyController = { addProperty, getAllPropery };
