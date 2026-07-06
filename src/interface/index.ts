import { Role } from "../../generated/prisma/enums";

export interface IResisterPayload {
    name: string;
    email: string;
    password: string;
    role?: Role;
    profilePhoto?: string;
    bio?: string;
}
