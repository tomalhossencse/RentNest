import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import rentalService from "./rental.service";

const getRentalHistory = catchAsync(async (req: Request, res: Response) => {
    const landlordId = req.user.id;
    const result = await rentalService.getRentalHistory(landlordId);
    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Rental history Retrived  successfully",
        data: result,
    });
});

export const rentalController = { getRentalHistory };
