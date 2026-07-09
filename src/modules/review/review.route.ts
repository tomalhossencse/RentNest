import { Router } from "express";

import { auth } from "../../middlewares/auth";
import { reviewController } from "./review.controller";

const reviewRoutes = Router();

reviewRoutes.post("/", auth("TENANT", "ADMIN"), reviewController.createReview);

export default reviewRoutes;
