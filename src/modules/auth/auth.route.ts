import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";

const authRoutes = Router();

authRoutes.post("/register", authController.registerUser);
authRoutes.post("/login", authController.loginUser);
authRoutes.post("/refresh-token", authController.refreshToken);
authRoutes.get("/me", auth(), authController.getCurrentUser);
authRoutes.get("/users", auth("ADMIN"), authController.getAllUsers);
authRoutes.patch("/users/:id", auth("ADMIN"), authController.updateUser);

export default authRoutes;
