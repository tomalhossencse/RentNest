import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import authRoutes from "./modules/auth/auth.route";
import { globalErrorHandler } from "./utils/globalError";
import { notFound } from "./utils/notFound";
import categoriesRoute from "./modules/category/category.route";
import propertyRoutes from "./modules/property/property.route";
import requestRoutes from "./modules/request/request.route";
import paymentRoutes from "./modules/payment/payment.route";
import reviewRoutes from "./modules/review/review.route";

const app: Application = express();

app.use(
    cors({
        origin: config.app_url,
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoriesRoute);
app.use("/api/properties", propertyRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
