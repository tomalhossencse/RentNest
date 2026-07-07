import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { paymentCotroller } from "./payment.controller";

const paymentRoutes = Router();

paymentRoutes.post("/create", auth("TENANT"), paymentCotroller.initiatePayment);
paymentRoutes.post("/confirm", paymentCotroller.verifyPayment);

export default paymentRoutes;
