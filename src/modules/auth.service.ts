import bcrypt from "bcryptjs";
import { IResisterPayload } from "../interface";
import config from "../config";
import { prisma } from "../lib/prisma";

class AuthService {
    private async hashPassword(password: string) {
        const hashedPassword = await bcrypt.hash(
            password,
            Number(config.bcrypt_salt_rounds),
        );
        return hashedPassword;
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
}

export default new AuthService();
