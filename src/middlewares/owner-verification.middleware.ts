import { generalResponse } from "@/common/helper/response.helper";
import { GeneralResponseType } from "@/common/types";
import { GARAGE_MESSAGE } from "@/modules/garage/messages";
import { findOneGarage } from "@/repositories/garages.repository";
import { NextFunction, Request, Response } from "express";

export const verifyOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      409
    );
  }
  req.garage = garage;
  next();
};
