import bcrypt from "bcryptjs";
import { ILoginPayload, IResisterPayload, JwtPayload } from "../types";
import config from "../config";
import { prisma } from "../lib/prisma";
import { signToken } from "../utils/jwt";

class AuthService {
    private async hashPassword(password: string) {
        const hashedPassword = await bcrypt.hash(
            password,
            Number(config.bcrypt_salt_rounds),
        );
        return hashedPassword;
    }

    private async comparePassword(password: string, hashedPassword: string) {
        const isMatchPassword = await bcrypt.compare(password, hashedPassword);
        return isMatchPassword;
    }

    async createUserIntoDB(payload: IResisterPayload) {
        const { password, email, name, bio, profilePhoto, role } = payload;

        const isUserExist = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (isUserExist) {
            throw new Error("User with this email already exists");
        }

        const hashedPassword = await this.hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                role,
                profilePhoto,
                bio,
                password: hashedPassword,
            },
            omit: {
                password: true,
            },
        });

        return user;
    }

    async loginUserFromDb(payload: ILoginPayload) {
        const { email, password } = payload;

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new Error("User  with this email  not exits!");
        }

        if (user.status === "BLOCKED") {
            throw new Error(
                "Your account has been blocked.Please contact for support!",
            );
        }

        const isPasswordMatch = await this.comparePassword(
            password,
            user.password,
        );

        if (!isPasswordMatch) {
            throw new Error("Your password is incorrect!");
        }

        const jwtPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        const { accessToken } = signToken(jwtPayload);

        return {
            accessToken,
            user,
        };
    }

    async getCurrentUser(userId: string) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            omit: {
                password: true,
            },
        });

        return user;
    }
}

export default new AuthService();
