import { Router } from "express";
import { requestController } from "./request.controller";
import { auth } from "../../middlewares/auth";

const requestRoutes = Router();

requestRoutes.post(
    "/",
    auth("TENANT", "ADMIN"),
    requestController.createRequest,
);

requestRoutes.get(
    "/landlord",
    auth("LANDLORD", "ADMIN"),
    requestController.getRequestforLandLord,
);

requestRoutes.patch(
    "/landlord/:id",
    auth("LANDLORD", "ADMIN"),
    requestController.updateRequestStatus,
);

requestRoutes.get(
    "/tenant",
    auth("TENANT", "ADMIN"),
    requestController.getRequestForTenant,
);

requestRoutes.get(
    "/:id",
    auth("TENANT", "LANDLORD", "ADMIN"),
    requestController.getRequestDetails,
);

requestRoutes.get("/", auth("ADMIN"), requestController.getAllRequestForAdmin);

export default requestRoutes;
