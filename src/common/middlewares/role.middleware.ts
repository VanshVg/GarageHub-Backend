import { generalResponse } from "@/common/helper/response.helper";
import { AUTH_MIDDLEWARE_MESSAGES } from "@/common/messages";
import { GeneralResponseType, UserRoles } from "@/common/types";
import User from "@/sequelize-dir/models/users.model";
import { NextFunction, Request, Response } from "express";

export const roleGuard = (role: UserRoles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!role.includes(req?.user?.role)) {
      return generalResponse(
        res,
        null,
        AUTH_MIDDLEWARE_MESSAGES.NOT_AUTHORIZED,
        GeneralResponseType.Error,
        true,
        401
      );
    }
    return next();
  };
};
