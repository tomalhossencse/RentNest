import { prisma } from "../../lib/prisma";
import { ICreatePropery } from "../../types";

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
}

export default new PropertyService();
