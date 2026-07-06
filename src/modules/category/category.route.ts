import { Router } from "express";

import { auth } from "../../middlewares/auth";
import { categoryController } from "./category.controller";

const categoriesRoute = Router();

categoriesRoute.post("/", auth("ADMIN"), categoryController.createCategory);
categoriesRoute.get("/", categoryController.getAllCategory);

export default categoriesRoute;
