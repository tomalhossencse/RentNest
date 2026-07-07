import { District } from "../../../generated/prisma/enums";
import { PropertyWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { ICreatePropery, IPropertyQuery, IUpdatePropery } from "../../types";

class PropertyService {
    async addProperty(payload: ICreatePropery, landlordId: string) {
        const result = await prisma.property.create({
            data: {
                ...payload,
                landlordId,
            },
        });

        return result;
    }

    async getALlProperty(query: IPropertyQuery) {
        const limit = query.limit ? Number(query.limit) : 5;
        const page = query.page ? Number(query.page) : 1;
        const skip = (page - 1) * limit;
        const sortBy = query.sortBy ? query.sortBy : "createdAt";
        const sortOrder = query.sortOrder ? query.sortOrder : "desc";

        const andConditions: PropertyWhereInput[] = [];

        if (query.searchTerm) {
            andConditions.push({
                // searching
                OR: [
                    {
                        title: {
                            contains: query.searchTerm,
                            mode: "insensitive",
                        },
                    },
                    {
                        description: {
                            contains: query.searchTerm,
                            mode: "insensitive",
                        },
                    },
                    {
                        address: {
                            contains: query.searchTerm,
                            mode: "insensitive",
                        },
                    },
                ],
            });
        }

        if (query.district) {
            andConditions.push({
                district: query.district,
            });
        }

        if (query.division) {
            andConditions.push({
                division: query.division,
            });
        }

        if (query.category) {
            andConditions.push({
                category: {
                    name: query.category as string,
                },
            });
        }

        if (query.landlordId) {
            andConditions.push({
                landlordId: query.landlordId,
            });
        }

        const properties = await prisma.property.findMany({
            where: {
                AND: andConditions,
            },
            // pagination
            take: limit,
            skip: skip,
            //sorting
            orderBy: {
                [sortBy]: sortOrder,
            },
            omit: {
                description: true,
                landlordId: true,
                categoryId: true,
            },
            include: {
                lanlord: {
                    select: {
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
        });

        const totalPropertyCount = await prisma.property.count({
            where: {
                AND: andConditions,
            },
        });

        return {
            data: properties,
            meta: {
                limit,
                page,
                total: totalPropertyCount,
                totalPages: Math.ceil(totalPropertyCount / limit),
            },
        };
    }

    async getPropertyDetails(propertyId: string) {
        const property = await prisma.property.findUnique({
            where: {
                id: propertyId,
            },
            include: {
                lanlord: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!property) {
            throw new Error("This Propery is not Exits");
        }

        return property;
    }

    async updateProperty(
        propertyId: string,
        landlordId: string,
        isAdmin: Boolean,
        updatedpayload: IUpdatePropery,
    ) {
        const property = await prisma.property.findUnique({
            where: {
                id: propertyId,
            },
        });

        if (!property) {
            throw new Error("This Propery is not Exits");
        }

        if (!isAdmin && landlordId !== property.landlordId) {
            throw new Error("You are not the ower of this Property");
        }
        const updatedproperty = await prisma.property.update({
            where: {
                id: propertyId,
            },
            data: updatedpayload,
            include: {
                lanlord: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return updatedproperty;
    }
}

export default new PropertyService();
