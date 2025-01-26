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
  updateServices,
} from "@/repositories/services.repository";
import { ServiceStatus } from "@/sequelize-dir/models/types/services.type";

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

export const updateGarageService = catchAsync(
  async (req: Request, res: Response) => {
    const { garage, service } = req;

    const { category, name, description, price, duration, duration_unit } =
      req.body as ICreateServiceBody;

    let category_id = service.category_id;
    if (category) {
      const isCategory = await findOneServiceCategory({
        where: { name: category },
        raw: true,
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

      category_id = isCategory.id;
    }

    const updatedService = await updateServices(
      {
        garage_id: garage.id,
        category_id,
        name: name || service.name,
        description: description || service.description,
        price: price ? parseFloat(price.toFixed(2)) : service.price,
        duration: duration || service.duration,
        duration_unit: duration_unit || service.duration_unit,
      },
      { where: { id: service.id } }
    );

    return generalResponse(
      res,
      updatedService[1][0],
      SERVICE_MESSAGE.SERVICE_UPDATE_SUCCESSFUL,
      GeneralResponseType.Success,
      true,
      200
    );
  }
);

export const changeServiceStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { service } = req;

    await updateServices(
      {
        status:
          service.status === ServiceStatus.Available
            ? ServiceStatus.Unavailable
            : ServiceStatus.Available,
      },
      { where: { id: service.id } }
    );

    return generalResponse(
      res,
      null,
      SERVICE_MESSAGE.STATUS_UPDATE_SUCCESSFUL,
      GeneralResponseType.Success,
      true,
      200
    );
  }
);
