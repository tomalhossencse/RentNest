import { Response } from "express";

type TMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

type TResponseData<T> = {
    success: boolean;
    status: number;
    message: string;
    data?: T;
    meta?: TMeta;
};

export function sendResponse<T>(res: Response, data: TResponseData<T>) {
    res.status(data.status).json({
        success: data.success,
        statusCode: data.status,
        message: data.message,
        data: data.data,
        meta: data.meta,
    });
}
