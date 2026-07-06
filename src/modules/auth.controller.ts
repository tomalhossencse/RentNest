import { Request, Response } from "express";
import authService from "./auth.service";
import { catchAsync } from "../utils/catchAsync";
import { IResisterPayload } from "../interface";
import { sendResponse } from "../utils/sendResponse";
import httpStatus from "http-status";

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const { email, name, password } = req.body as IResisterPayload;

    if (!email || !name || !password) {
        throw new Error("Please Provide your email, password and name!");
    }

    const result = await authService.createUserIntoDB(req.body);

    sendResponse(res, {
        success: true,
        status: httpStatus.CREATED,
        message: "User registerd Successfully",
        data: result,
    });
});

export const authController = { registerUser };
