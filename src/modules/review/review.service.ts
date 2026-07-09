import { prisma } from "../../lib/prisma";
import { ICreateReview } from "../../types";

class ReviewService {
    async createReview(
        tenantId: string,
        isAdmin: boolean,
        payload: ICreateReview,
    ) {
        const rental = await prisma.rental.findUnique({
            where: {
                id: payload.rentalId,
            },
            include: {
                request: true,
            },
        });

        if (!rental) {
            throw new Error("This Rental is not Available");
        }

        if (!isAdmin && rental?.tenantId !== tenantId) {
            throw new Error(
                "You are not authorized  make Review fot this property",
            );
        }
        const review = await prisma.review.create({
            data: {
                propertyId: rental.request.propertyId,
                tenantId: tenantId,
                ...payload,
            },
        });

        return review;
    }
}

export default new ReviewService();
