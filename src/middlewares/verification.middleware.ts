import { generalResponse } from "@/common/helper/response.helper";
import { SERVER_MESSAGES } from "@/common/messages";
import { GeneralResponseType } from "@/common/types";
import { GARAGE_MESSAGE } from "@/modules/garage/messages";
import { SERVICE_MESSAGE } from "@/modules/service/messages";
import { findOneGarage } from "@/repositories/garages.repository";
import { findOneService } from "@/repositories/services.repository";
import { NextFunction, Request, Response } from "express";

export const verifyOwner = async (
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

export const verifyGarageService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { garage } = req;
    const { serviceId } = req.params;

    const service = await findOneService({
      where: { id: serviceId },
      raw: true,
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

    if (service.garage_id !== garage.id) {
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
