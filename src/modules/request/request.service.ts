import { RequestStatus } from "../../../generated/prisma/enums";
import { RequestWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { ICreateRequest, IReqeustQuery } from "../../types";

class RequestService {
    async createRequest(tenantId: string, payload: ICreateRequest) {
        const request = await prisma.request.create({
            data: {
                tenantId,
                ...payload,
            },
        });

        return request;
    }

    async getRequestforLandLord(landlordId: string) {
        const requests = await prisma.request.findMany({
            where: {
                property: {
                    landlordId,
                },
            },
        });

        return requests;
    }

    async updateRequestStatus(
        requestId: string,
        landlordId: string,
        isAdmin: boolean,
        status: RequestStatus,
    ) {
        const request = await prisma.request.findUnique({
            where: {
                id: requestId,
            },
            include: {
                property: true,
            },
        });

        if (!isAdmin && request?.property.landlordId !== landlordId) {
            throw new Error(
                "You are not authorized to manage this property request.",
            );
        }

        if (request?.status === status) {
            throw new Error(
                `Your provided status (${status}) is already up to date.`,
            );
        }

        const updatedRequest = await prisma.request.update({
            where: {
                id: requestId,
            },
            data: {
                status,
            },
        });

        return updatedRequest;
    }

    async getRequestDetails(
        requestId: string,
        userId: string,
        isAdmin: boolean,
    ) {
        const request = await prisma.request.findUnique({
            where: {
                id: requestId,
            },
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },

                property: {
                    select: {
                        id: true,
                        title: true,
                        division: true,
                        district: true,
                        lanlord: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                        category: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (
            !isAdmin &&
            request?.tenantId !== userId &&
            request?.property.lanlord.id !== userId
        ) {
            throw new Error(
                "You are not authorized to get details of this property request.",
            );
        }

        return request;
    }

    async getRequestforTenant(tenantId: string) {
        const requests = await prisma.request.findMany({
            where: {
                tenantId,
            },
        });

        return requests;
    }

    async getAllRequestforAdmin(query: IReqeustQuery) {
        const limit = query.limit ? Number(query.limit) : 5;
        const page = query.page ? Number(query.page) : 1;
        const skip = (page - 1) * limit;
        const sortBy = query.sortBy ? query.sortBy : "createdAt";
        const sortOrder = query.sortOrder ? query.sortOrder : "desc";

        const andConditions: RequestWhereInput[] = [];

        if (query.status) {
            andConditions.push({
                status: query.status,
            });
        }

        if (query.propertyId) {
            andConditions.push({
                propertyId: query.propertyId,
            });
        }

        if (query.tenantId) {
            andConditions.push({
                tenantId: query.tenantId,
            });
        }

        const requests = await prisma.request.findMany({
            where: {
                AND: andConditions,
            },

            take: limit,
            skip,

            orderBy: {
                [sortBy]: sortOrder,
            },
        });

        const totalRequestCount = await prisma.request.count({
            where: {
                AND: andConditions,
            },
        });

        return {
            data: requests,
            meta: {
                limit,
                page,
                total: totalRequestCount,
                totalPages: Math.ceil(totalRequestCount / limit),
            },
        };
    }
}

export default new RequestService();
