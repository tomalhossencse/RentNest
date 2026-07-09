import { Router } from "express";
import { requestController } from "./request.controller";
import { auth } from "../../middlewares/auth";

const requestRoutes = Router();

requestRoutes.post("/", auth("TENANT"), requestController.createRequest);

requestRoutes.get(
    "/landlord",
    auth("LANDLORD"),
    requestController.getRequestforLandLord,
);

requestRoutes.patch(
    "/landlord/:id",
    auth("LANDLORD"),
    requestController.updateRequestStatus,
);

requestRoutes.get(
    "/tenant",
    auth("TENANT"),
    requestController.getRequestForTenant,
);

requestRoutes.get(
    "/:id",
    auth("TENANT", "LANDLORD", "ADMIN"),
    requestController.getRequestDetails,
);

requestRoutes.get("/", auth("ADMIN"), requestController.getAllRequestForAdmin);

export default requestRoutes;
