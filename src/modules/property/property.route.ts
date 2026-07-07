import { Router } from "express";
import { propertyController } from "./property.controller";
import { auth } from "../../middlewares/auth";

const propertyRoutes = Router();

propertyRoutes.post("/", auth("LANDLORD"), propertyController.addProperty);
propertyRoutes.get("/", propertyController.getAllPropery);
propertyRoutes.get("/:id", propertyController.getProperyDetails);
propertyRoutes.put(
    "/:id",
    auth("LANDLORD", "ADMIN"),
    propertyController.updateProperty,
);

export default propertyRoutes;
