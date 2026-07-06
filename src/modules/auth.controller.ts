import { Request, Response } from "express";
import authService from "./auth.service";
import { catchAsync } from "../utils/catchAsync";
import { ILoginPayload, IResisterPayload } from "../types";
import { sendResponse } from "../utils/sendResponse";
import httpStatus from "http-status";
import { send } from "node:process";

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

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body as ILoginPayload;

    if (!email || !password) {
        throw new Error("Please Provide your email and password !");
    }

    const { accessToken, refreshToken, user } =
        await authService.loginUserFromDb({
            email,
            password,
        });

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "User logged in successfully",
        data: {
            accessToken,
        },
    });
});

const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.getCurrentUser(req.user.id);
    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "user profile retrived successfully",
        data: result,
    });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    const { accessToken } = await authService.refreshToken(refreshToken);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60,
    });

    return sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Token refreshed successfully",
        data: { accessToken },
    });
});

export const authController = {
    registerUser,
    loginUser,
    getCurrentUser,
    refreshToken,
};
