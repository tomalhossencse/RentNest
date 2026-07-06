import jwt, { SignOptions } from "jsonwebtoken";
import config from "../config";
import { JwtPayload } from "../types";
export const signToken = (payload: JwtPayload) => {
    const accessToken = jwt.sign(payload, config.jwt_access_secret, {
        expiresIn: config.jwt_access_expires_in,
    } as SignOptions);

    const refreshToken = jwt.sign(payload, config.jwt_refresh_secret, {
        expiresIn: config.jwt_refresh_expires_in,
    } as SignOptions);

    return { accessToken, refreshToken };
};

export const verifyToken = (token: string, type: "access" | "refresh") => {
    try {
        const secret =
            type === "access"
                ? config.jwt_access_secret
                : config.jwt_refresh_secret;

        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (error: any) {
        console.log("Token verification Failed");
        throw new Error(error.message);
    }
};
