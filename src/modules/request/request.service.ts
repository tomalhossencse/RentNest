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
                        category: true,
                        division: true,
                        district: true,
                    },
                },
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

        return updatedRequest;
    }
}

export default new RequestService();
