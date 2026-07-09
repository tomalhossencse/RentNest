import { prisma } from "../../lib/prisma";
import { ICreateReview } from "../../types";

class ReviewService {
    async createReview(tenantId: string, payload: ICreateReview) {
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

        if (rental?.tenantId !== tenantId) {
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

    async getReviews(landlordId: string) {
        const reviews = await prisma.review.findMany({
            where: {
                rental: {
                    request: {
                        property: {
                            landlordId,
                        },
                    },
                },
            },
        });

        return reviews;
    }
}

export default new ReviewService();
