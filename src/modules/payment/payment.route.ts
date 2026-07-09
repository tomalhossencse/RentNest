import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { paymentCotroller } from "./payment.controller";

const paymentRoutes = Router();

paymentRoutes.post(
    "/create",
    auth("TENANT", "ADMIN"),
    paymentCotroller.initiatePayment,
);
paymentRoutes.post("/confirm", paymentCotroller.verifyPayment);

paymentRoutes.get(
    "/",
    auth("TENANT", "ADMIN"),
    paymentCotroller.getTenantPayments,
);

paymentRoutes.get(
    "/:id",
    auth("TENANT", "ADMIN"),
    paymentCotroller.getPaymentsDetails,
);

export default paymentRoutes;
