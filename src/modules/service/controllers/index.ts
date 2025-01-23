import { catchAsync } from "@/common/helper/catch-async.helper";
import { Request, Response } from "express";
import { ICreateServiceBody } from "../types";
import { findOneServiceCategory } from "@/repositories/service-categories.repository";
import { generalResponse } from "@/common/helper/response.helper";
import { SERVICE_MESSAGE } from "../messages";
import { GeneralResponseType } from "@/common/types";
import {
  createServices,
  findAllServices,
} from "@/repositories/services.repository";

export const addServices = catchAsync(async (req: Request, res: Response) => {
  const { garage } = req;
  const { category, name, description, price, duration, duration_unit } =
    req.body as ICreateServiceBody;

  const isCategory = await findOneServiceCategory({
    where: { name: category },
  });
  if (!isCategory) {
    return generalResponse(
      res,
      null,
      SERVICE_MESSAGE.CATEGORY_UNAVAILABLE,
      GeneralResponseType.Error,
      true,
      404
    );
  }

  const service = await createServices({
    garage_id: garage.id,
    category_id: isCategory.id,
    name,
    description,
    price: parseFloat(price.toFixed(2)),
    duration,
    duration_unit,
  });

  return generalResponse(
    res,
    service,
    SERVICE_MESSAGE.CREATE_SERVICE_SUCCESS,
    GeneralResponseType.Success,
    true,
    200
  );
});

export const fetchGarageServices = catchAsync(
  async (req: Request, res: Response) => {
    const { garage } = req;

    const services = await findAllServices({
      where: { garage_id: garage.id },
      raw: true,
    });
    if (services.length === 0) {
      return generalResponse(
        res,
        null,
        SERVICE_MESSAGE.NO_GARAGE_SERVICES,
        GeneralResponseType.Error,
        true,
        404
      );
    }

    return generalResponse(
      res,
      services,
      SERVICE_MESSAGE.SERVICES_FETCH_SUCCESS,
      GeneralResponseType.Success,
      false,
      200
    );
  }
);
