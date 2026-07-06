import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import httpStatus from "http-status";
import { sendResponse } from "../utils/sendResponse";
import { prisma } from "../lib/prisma";
import { JwtPayload } from "../types";

export const auth = (...roles: Role[]) => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const accessToken = req.cookies.accessToken
                ? req.cookies.accessToken
                : req.headers.authorization?.startsWith("Bearer ")
                  ? req.headers.authorization?.split(" ")[1]
                  : req.headers.authorization;

            const payload = verifyToken(accessToken, "access") as JwtPayload;

            if (!payload) {
                return sendResponse(res, {
                    success: false,
                    message: "Your token is Invalid",
                    status: httpStatus.UNAUTHORIZED,
                });
            }

            const user = await prisma.user.findUnique({
                where: {
                    id: payload.id,
                },
            });

            if (!user) {
                throw new Error("User not Found. Please login again");
            }

            const { id, name, email, role } = user;

            req.user = { id, name, email, role };

            if (!req.user) {
                return sendResponse(res, {
                    success: false,
                    message: "unauthorized access",
                    status: httpStatus.UNAUTHORIZED,
                });
            }

            if (roles.length && !roles.includes(req.user.role)) {
                return sendResponse(res, {
                    success: false,
                    message: "You have no permissions to access",
                    status: httpStatus.FORBIDDEN,
                });
            }

            next();
        },
    );
};
