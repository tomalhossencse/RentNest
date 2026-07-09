import { ICreateReview } from "../../types";
import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import reviewService from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    if (!payload) {
        throw new Error("Please provide payload!");
    }
    const { rentalId, rating } = payload as ICreateReview;
    const tenantId = req.user.id;

    if (!rating || !rentalId) {
        throw new Error("Please enter rentalId and rating");
    }

    const result = await reviewService.createReview(tenantId, payload);

    sendResponse(res, {
        success: true,
        status: httpStatus.CREATED,
        message: "Review created  successfully",
        data: result,
    });
});

const getReviews = catchAsync(async (req: Request, res: Response) => {
    const landlordId = req.user.id;
    const result = await reviewService.getReviews(landlordId);

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Get tenant reviews successfully",
        data: result,
    });
});

export const reviewController = { createReview, getReviews };
