import { PropertyWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
    ICreatePropery,
    IPropertyQuery,
    IUpdatePropery,
    IUpdateProperyStatus,
} from "../../types";

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

    async getAllProperty(query: IPropertyQuery) {
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

        if (query.minRent) {
            andConditions.push({
                monthlyRent: {
                    gte: Number(query.minRent),
                },
            });
        }
        if (query.maxRent) {
            andConditions.push({
                monthlyRent: {
                    lte: Number(query.maxRent),
                },
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
                landlord: {
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
                landlord: {
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
                landlord: {
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

    async deleteProperty(
        propertyId: string,
        landlordId: string,
        isAdmin: Boolean,
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
        const deletedproperty = await prisma.property.delete({
            where: {
                id: propertyId,
            },
            include: {
                landlord: {
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

        return deletedproperty;
    }

    async updatePropertyStatus(
        propertyId: string,
        landlordId: string,
        isAdmin: Boolean,
        status: IUpdateProperyStatus,
    ) {
        const property = await prisma.property.findUnique({
            where: {
                id: propertyId,
            },
        });

        if (!property) {
            throw new Error("This Propery is not Exits");
        }

        if (property?.status === "RENTED") {
            throw new Error("This propery is already rented");
        }

        if (property?.status === status) {
            throw new Error(
                `Your provided status (${status}) is already up to date.`,
            );
        }
        if (!isAdmin && landlordId !== property.landlordId) {
            throw new Error("You are not the ower of this Property");
        }
        const updatedproperty = await prisma.property.update({
            where: {
                id: propertyId,
            },
            data: { status },
            include: {
                landlord: {
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
