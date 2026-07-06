import { prisma } from "../../lib/prisma";
import { ICreateCategory } from "../../types";

class CategoryService {
    async createCategory(payload: ICreateCategory) {
        const category = await prisma.category.create({
            data: payload,
        });

        return category;
    }

    async getAllCategory() {
        const categories = await prisma.category.findMany();
        return categories;
    }
}

export default new CategoryService();
