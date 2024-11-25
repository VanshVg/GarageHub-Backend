import { HttpException } from "@/common/exceptions/http.exception";
import { generalResponse } from "@/common/helper/response.helper";
import { logger } from "@/common/logger";
import { AxiosError } from "axios";
import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.log("info", error);

    if (error instanceof HttpException) {
      const errorData = (error as any)?.metadata;
      const status: number = errorData.status || 500;
      const message: string = error.message || "Something went wrong!";
      const data: any = errorData.data || {};
      const toast: boolean = errorData.toast;

      logger.error(
        `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}, Toast:: ${toast}`
      );
      return generalResponse(res, data, message, "error", toast, status);
    }
    // axios Error
    else if (error instanceof AxiosError) {
      return generalResponse(
        res,
        {
          code: error.code,
          detailError: error.response?.data,
        },
        error.response?.data,
        "error",
        false,
        error.response?.status || 500
      );
    } else if (error instanceof Error) {
      return generalResponse(
        res,
        error,
        "Something went wrong",
        "error",
        true,
        400
      );
    }
  } catch (err) {
    next(err);
  }
};

process.on("unhandledRejection", (error) => {
  logger.log("info", "Unhandled Rejection", error);
});

process.on("uncaughtException", (error) => {
  logger.log("info", "Uncaught Exception", error);
});
