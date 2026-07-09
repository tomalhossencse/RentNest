import { prisma } from "../../lib/prisma";

class RentalService {
    async getRentalHistory(landlordId: string) {
        const rentals = await prisma.rental.findMany({
            where: {
                request: {
                    property: {
                        landlordId,
                    },
                },
            },
        });

        return rentals;
    }
}
export default new RentalService();
