import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import categoryService from "./category.service";
import { ICreateCategory } from "../../types";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createCategory = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const { name } = payload as ICreateCategory;

    if (!name) {
        throw new Error("category name is required to create new Category");
    }

    const result = await categoryService.createCategory(payload);

    sendResponse(res, {
        success: true,
        status: httpStatus.CREATED,
        message: "New category created Successfully",
        data: result,
    });
});

const getAllCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryService.getAllCategory();

    sendResponse(res, {
        success: true,
        status: httpStatus.OK,
        message: "Categories retrived successfully",
        data: result,
    });
});
export const categoryController = { createCategory, getAllCategory };
