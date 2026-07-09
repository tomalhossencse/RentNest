import {
    District,
    Division,
    PropertyStatus,
    RequestStatus,
    Role,
} from "../../generated/prisma/enums";
import {
    PropertyWhereInput,
    RequestWhereInput,
} from "../../generated/prisma/models";

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
export interface IUpdatePropery {
    title?: string;
    description?: string;
    monthlyRent?: number;
    division?: Division;
    district?: District;
    address?: string;
    categoryId?: string;
    status?: PropertyStatus;
    floor?: number;
    image?: string;
    availableFrom?: string;
}
export type IUpdateProperyStatus = Exclude<PropertyStatus, "RENTED">;

export interface IPropertyQuery extends PropertyWhereInput {
    searchTerm?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
    minRent?: string;
    maxRent?: string;
}

export interface IReqeustQuery extends RequestWhereInput {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
}

export interface ICreateRequest {
    propertyId: string;
    moveInDate: string;
    message?: string;
}

export interface ICreateReview {
    rentalId: string;
    rating: number;
    comment?: string;
}
