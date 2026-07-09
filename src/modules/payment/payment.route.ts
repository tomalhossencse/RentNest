import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { paymentCotroller } from "./payment.controller";

const paymentRoutes = Router();

paymentRoutes.post("/create", auth("TENANT"), paymentCotroller.initiatePayment);
paymentRoutes.post("/confirm", paymentCotroller.verifyPayment);

paymentRoutes.get("/", auth("TENANT"), paymentCotroller.getTenantPayments);

paymentRoutes.get("/:id", auth("TENANT"), paymentCotroller.getPaymentsDetails);

export default paymentRoutes;
