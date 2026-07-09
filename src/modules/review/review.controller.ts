import { ICreateReview } from "../../types";
import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import reviewService from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const { rentalId, rating } = payload as ICreateReview;
    const tenantId = req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    if (!rating || !rentalId) {
        throw new Error("Please enter rentalId and rating");
    }

    const result = await reviewService.createReview(tenantId, isAdmin, payload);

    sendResponse(res, {
        success: true,
        status: httpStatus.CREATED,
        message: "Review created  successfully",
        data: result,
    });
});

export const reviewController = { createReview };
