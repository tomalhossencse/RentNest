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

export default requestRoutes;
