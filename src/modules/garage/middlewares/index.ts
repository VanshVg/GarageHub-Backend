import { generalResponse } from "@/common/helper/response.helper";
import { findOneGarage } from "@/repositories/garages.repository";
import { NextFunction, Request, Response } from "express";
import { GARAGE_MESSAGE } from "../messages";
import { GeneralResponseType } from "@/common/types";
import { SERVER_MESSAGES } from "@/common/messages";

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
