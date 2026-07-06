import { prisma } from "../../lib/prisma";
import { ICreateCategory } from "../../types";

class CategoryService {
    async createCategory(payload: ICreateCategory) {
        const category = await prisma.category.create({
            data: payload,
        });

        return category;
    }
}

export default new CategoryService();
