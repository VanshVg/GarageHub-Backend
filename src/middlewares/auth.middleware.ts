import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { generalResponse } from "@/common/helper/response.helper";
import { GeneralResponseEnum } from "@/common/types";
import { AUTH_MIDDLEWARE_MESSAGES } from "@/common/messages";
import User from "@/sequelize-dir/models/users.model";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "jwt",
    { session: false },
    async (error, user: User) => {
      if (error) {
        return next(error);
      }
      if (!user) {
        return generalResponse(
          res,
          [],
          AUTH_MIDDLEWARE_MESSAGES.TOKEN_EXPIRED,
          GeneralResponseEnum.error,
          true,
          401
        );
      }

      if (!user.verified) {
        return generalResponse(
          res,
          [],
          AUTH_MIDDLEWARE_MESSAGES.NOT_VERIFIED,
          GeneralResponseEnum.error,
          true,
          401
        );
      }
      req.user = user;
      return next();
    }
  )(req, res, next);
};
