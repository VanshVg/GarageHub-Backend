import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { generalResponse } from "@/common/helper/response.helper";
import { GeneralResponseType } from "@/common/types";
import { AUTH_MIDDLEWARE_MESSAGES, SERVER_MESSAGES } from "@/common/messages";
import User from "@/sequelize-dir/models/users.model";
import { findOneGarage } from "@/repositories/garages.repository";
import { GARAGE_MESSAGE } from "@/modules/garage/messages";
import { findOneService } from "@/repositories/services.repository";
import { SERVICE_MESSAGE } from "@/modules/service/messages";
import Garage from "@/sequelize-dir/models/garages.model";

export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
          GeneralResponseType.Error,
          true,
          401
        );
      }

      if (!user.verified) {
        return generalResponse(
          res,
          [],
          AUTH_MIDDLEWARE_MESSAGES.NOT_VERIFIED,
          GeneralResponseType.Error,
          true,
          401
        );
      }
      req.user = user;
      return next();
    }
  )(req, res, next);
};

export const garageAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { garageId } = req.params;
    const { id } = req.user;

    const garage = await findOneGarage({ where: { id: garageId }, raw: true });

    if (!garage) {
      return generalResponse(
        res,
        null,
        GARAGE_MESSAGE.GARAGE_NOT_FOUND,
        GeneralResponseType.Error,
        true,
        404
      );
    }

    if (garage.owner_id !== id) {
      return generalResponse(
        res,
        null,
        GARAGE_MESSAGE.WRONG_OWNER,
        GeneralResponseType.Error,
        true,
        403
      );
    }
    req.garage = garage;
    next();
  } catch (error) {
    return generalResponse(
      res,
      null,
      SERVER_MESSAGES.INTERNAL_ERROR,
      GeneralResponseType.Error,
      true,
      500
    );
  }
};

export const serviceAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;
    const { serviceId } = req.params;

    const service = await findOneService({
      where: { id: serviceId },
      raw: true,
      include: {
        model: Garage,
      },
    });
    if (!service) {
      return generalResponse(
        res,
        null,
        SERVICE_MESSAGE.SERVICE_NOT_FOUND,
        GeneralResponseType.Error,
        true,
        404
      );
    }

    if (service?.garage?.owner_id !== user.id) {
      return generalResponse(
        res,
        null,
        GARAGE_MESSAGE.WRONG_OWNER,
        GeneralResponseType.Error,
        true,
        403
      );
    }
    req.service = service;
    next();
  } catch (error) {
    return generalResponse(
      res,
      null,
      SERVER_MESSAGES.INTERNAL_ERROR,
      GeneralResponseType.Error,
      true,
      500
    );
  }
};
