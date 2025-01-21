import { generalResponse } from "@/common/helper/response.helper";
import { AUTH_MIDDLEWARE_MESSAGES } from "@/common/messages";
import { GeneralResponseEnum, UserRoles } from "@/common/types";
import User from "@/sequelize-dir/models/users.model";
import { NextFunction, Request, Response } from "express";

export const roleGuard = (role: UserRoles) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if ((req.user as User).role !== role) {
      return generalResponse(
        res,
        null,
        AUTH_MIDDLEWARE_MESSAGES.NOT_AUTHORIZED,
        GeneralResponseEnum.error,
        true,
        401
      );
    }
    return next();
  };
};
