import {
    District,
    Division,
    PropertyStatus,
    Role,
} from "../../generated/prisma/enums";

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

export interface ICreateCategory {
    name: string;
    description?: string;
}

export interface ICreatePropery {
    title: string;
    description?: string;
    monthlyRent: number;
    division: Division;
    district: District;
    address: string;
    categoryId: string;
    status: PropertyStatus;
    floor: number;
    image?: string;
    availableFrom: string;
}
