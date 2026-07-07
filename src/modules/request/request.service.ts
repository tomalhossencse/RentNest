import { RequestStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateRequest } from "../../types";

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
}

export default new RequestService();
