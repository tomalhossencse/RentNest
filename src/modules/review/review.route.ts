import { Router } from "express";

import { auth } from "../../middlewares/auth";
import { reviewController } from "./review.controller";

const reviewRoutes = Router();

reviewRoutes.post("/", auth("TENANT"), reviewController.createReview);
reviewRoutes.get("/", auth("LANDLORD"), reviewController.getReviews);

export default reviewRoutes;
