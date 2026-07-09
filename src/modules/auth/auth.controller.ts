import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import {
    ILoginPayload,
    IResisterPayload,
    IUpdateUserStatus,
} from "../../types";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import authService from "./auth.service";
import { UserStatus } from "../../../generated/prisma/enums";

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    if (!payload) {
        throw new Error("Please provide payload!");
    }

    const { email, name, password, role } = payload as IResisterPayload;

    if (!email || !name || !password) {
        throw new Error(
            "Please provide your email, password and name as payload!",
        );
    }

    if (role && role !== "LANDLORD" && role !== "TENANT") {
        throw new Error("Please provide user role as (LANDLORD / TENANT)");
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
    const payload = req.body;

    if (!payload) {
        throw new Error("Please provide payload!");
    }

    const { email, password } = payload as ILoginPayload;

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

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.getAllUsers();
    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "All users retrived successfully",
        data: result,
    });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    if (!payload) {
        throw new Error("Please provide payload!");
    }
    const { status } = payload as IUpdateUserStatus;

    if (!status) {
        throw new Error("Please provide status in Payload!");
    }

    if (status !== "ACTIVE" && status !== "BLOCKED") {
        throw new Error("Please provide status (ACTIVE / BLOCKED)");
    }
    const userId = req.params.id;

    if (!status || !userId) {
        throw new Error("Please provide status in body and userId in Params");
    }

    const result = await authService.updateUser(userId as string, status);

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "user updated successfully",
        data: result,
    });
});

export const authController = {
    registerUser,
    loginUser,
    getCurrentUser,
    refreshToken,
    getAllUsers,
    updateUser,
};
