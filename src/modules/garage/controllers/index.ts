import { catchAsync } from "@/common/helper/catch-async.helper";
import { Request, Response } from "express";
import { findOneCity } from "@/repositories/cities.repository";
import { generalResponse } from "@/common/helper/response.helper";
import { GARAGE_MESSAGE } from "../messages";
import { GeneralResponseType } from "@/common/types";
import {
  createGarage,
  deleteGarage,
  findAllGarages,
  findOneGarage,
  updateGarage,
} from "@/repositories/garages.repository";
import moment from "moment";
import { ICreateGarageBody, IUpdateGarageBody } from "../types";
import { GarageStatus } from "@/sequelize-dir/models/types/garages.type";

export const addGarage = catchAsync(async (req: Request, res: Response) => {
  const {
    name,
    description,
    contact_no,
    email,
    address,
    city,
    pincode,
    end_time,
    start_time,
  } = req.body as ICreateGarageBody;
  const { id } = req.user;

  const cityData = await findOneCity({
    where: { name: city },
    raw: true,
  });
  if (!cityData) {
    return generalResponse(
      res,
      null,
      GARAGE_MESSAGE.CITY_UNAVAILABLE,
      GeneralResponseType.Error,
      true,
      404
    );
  }

  const garage = await createGarage({
    name,
    owner_id: id,
    description,
    contact_no,
    email: email || null,
    address,
    city_id: cityData.id,
    pincode,
    start_time: moment(start_time, "hh:mm").format("hh:mm A"),
    end_time: moment(end_time, "hh:mm").format("hh:mm A"),
  });

  return generalResponse(
    res,
    garage,
    GARAGE_MESSAGE.CREATE_GARAGE_SUCCESS,
    GeneralResponseType.Success,
    true,
    200
  );
});

export const getGarage = catchAsync(async (req: Request, res: Response) => {
  const { garageId } = req.params;

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

  return generalResponse(
    res,
    garage,
    GARAGE_MESSAGE.GARAGE_FOUND_SUCCESSFUL,
    GeneralResponseType.Success,
    false,
    200
  );
});

export const listOwnerGarages = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.user;

    const garages = await findAllGarages({
      where: { owner_id: id },
      raw: true,
    });

    if (garages.length === 0) {
      return generalResponse(
        res,
        null,
        GARAGE_MESSAGE.NO_OWNER_GARAGE_EXISTS,
        GeneralResponseType.Error,
        true,
        404
      );
    }

    return generalResponse(
      res,
      garages,
      GARAGE_MESSAGE.OWNER_GARAGE_FOUND_SUCCESSFUL,
      GeneralResponseType.Success,
      false,
      200
    );
  }
);

export const listGarages = catchAsync(async (req: Request, res: Response) => {
  const garages = await findAllGarages({ raw: true });

  if (garages.length === 0) {
    return generalResponse(
      res,
      null,
      GARAGE_MESSAGE.NO_GARAGE_EXISTS,
      GeneralResponseType.Error,
      true,
      404
    );
  }

  return generalResponse(
    res,
    garages,
    GARAGE_MESSAGE.GARAGE_FOUND_SUCCESSFUL,
    GeneralResponseType.Success,
    false,
    200
  );
});

export const updateGarageDetails = catchAsync(
  async (req: Request, res: Response) => {
    const {
      name,
      description,
      contact_no,
      email,
      address,
      city,
      pincode,
      end_time,
      start_time,
    } = req.body as IUpdateGarageBody;
    const { garageId } = req.params;
    const { garage } = req;

    let cityId = garage.city_id;

    if (city) {
      const cityData = await findOneCity({
        where: { name: city },
        raw: true,
      });
      if (!cityData) {
        return generalResponse(
          res,
          null,
          GARAGE_MESSAGE.CITY_UNAVAILABLE,
          GeneralResponseType.Error,
          true,
          404
        );
      }

      cityId = cityData.id;
    }

    const updatedGarage = await updateGarage(
      {
        name: name || garage.name,
        description: description || garage.description,
        email: email || garage.email,
        address: address || garage.address,
        city_id: cityId,
        pincode: pincode || garage.pincode,
        contact_no: contact_no || garage.contact_no,
        start_time: start_time
          ? moment(start_time, "hh:mm").format("hh:mm A")
          : garage.start_time,
        end_time: end_time
          ? moment(end_time, "hh:mm").format("hh:mm A")
          : garage.end_time,
      },
      { where: { id: garageId } }
    );

    return generalResponse(
      res,
      updatedGarage[1][0],
      GARAGE_MESSAGE.GARAGE_UPDATE_SUCCESSFUL,
      GeneralResponseType.Success,
      true,
      200
    );
  }
);

export const removeGarage = catchAsync(async (req: Request, res: Response) => {
  const { garageId } = req.params;

  await deleteGarage({ where: { id: garageId } });

  return generalResponse(
    res,
    null,
    GARAGE_MESSAGE.GARAGE_DELETE_SUCCESSFUL,
    GeneralResponseType.Success,
    true,
    200
  );
});

export const changeGarageStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { garageId } = req.params;
    const { garage } = req;

    await updateGarage(
      {
        status:
          garage.status === GarageStatus.Active
            ? GarageStatus.Inactive
            : GarageStatus.Active,
      },
      { where: { id: garageId } }
    );

    return generalResponse(
      res,
      null,
      GARAGE_MESSAGE.STATUS_UPDATE_SUCCESSFUL,
      GeneralResponseType.Success,
      true,
      200
    );
  }
);
