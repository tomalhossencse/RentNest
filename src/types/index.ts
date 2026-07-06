import { Role } from "../../generated/prisma/enums";

export interface IResisterPayload {
    name: string;
    email: string;
    password: string;
    role?: Role;
    profilePhoto?: string;
    bio?: string;
}

export interface ILoginPayload {
    email: string;
    password: string;
}

export interface JwtPayload {
    id: string;
    name: string;
    email: string;
    role: Role;
}
