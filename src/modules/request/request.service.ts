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
}

export default new RequestService();
