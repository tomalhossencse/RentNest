import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { rentalController } from "./rental.controller";

const rentalRoutes = Router();

rentalRoutes.get(
    "/",
    auth("LANDLORD", "ADMIN"),
    rentalController.getRentalHistory,
);

export default rentalRoutes;
