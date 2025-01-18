import { catchAsync } from "@/common/helper/catch-async.helper";
import { Request, Response } from "express";
import { findOneCity } from "@/repositories/cities.repository";
import { generalResponse } from "@/common/helper/response.helper";
import { GARAGE_MESSAGE } from "../messages";
import { GeneralResponseEnum } from "@/common/types";
import {
  createGarage,
  deleteGarage,
  findAllGarages,
  findOneGarage,
  updateGarage,
} from "@/repositories/garages.repository";
import moment from "moment";
import { ICreateGarageBody, IUpdateGarageBody } from "../types";

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
      GeneralResponseEnum.error,
      true,
      404
    );
  }

  await createGarage({
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
    null,
    GARAGE_MESSAGE.CREATE_GARAGE_SUCCESS,
    GeneralResponseEnum.success,
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
      GeneralResponseEnum.error,
      true,
      404
    );
  }

  return generalResponse(
    res,
    { data: garage },
    GARAGE_MESSAGE.GARAGE_FOUND_SUCCESSFUL,
    GeneralResponseEnum.success,
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
        GeneralResponseEnum.error,
        true,
        404
      );
    }

    return generalResponse(
      res,
      { data: garages },
      GARAGE_MESSAGE.OWNER_GARAGE_FOUND_SUCCESSFUL,
      GeneralResponseEnum.success,
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
      GeneralResponseEnum.error,
      true,
      404
    );
  }

  return generalResponse(
    res,
    { data: garages },
    GARAGE_MESSAGE.GARAGE_FOUND_SUCCESSFUL,
    GeneralResponseEnum.success,
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
    const { id } = req.user;

    const garage = await findOneGarage({ where: { id: garageId }, raw: true });

    if (!garage) {
      return generalResponse(
        res,
        null,
        GARAGE_MESSAGE.GARAGE_NOT_FOUND,
        GeneralResponseEnum.error,
        true,
        404
      );
    }

    if (garage.owner_id !== id) {
      return generalResponse(
        res,
        null,
        GARAGE_MESSAGE.WRONG_OWNER,
        GeneralResponseEnum.error,
        true,
        409
      );
    }

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
          GeneralResponseEnum.error,
          true,
          404
        );
      }

      cityId = cityData.id;
    }

    await updateGarage(
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

    const updatedGarage = await findOneGarage({
      where: { id: garageId },
      raw: true,
    });

    return generalResponse(
      res,
      { data: updatedGarage },
      GARAGE_MESSAGE.GARAGE_UPDATE_SUCCESSFUL,
      GeneralResponseEnum.success,
      true,
      200
    );
  }
);

export const removeGarage = catchAsync(async (req: Request, res: Response) => {
  const { garageId } = req.params;
  const { id } = req.user;

  const garage = await findOneGarage({ where: { id: garageId }, raw: true });

  if (!garage) {
    return generalResponse(
      res,
      null,
      GARAGE_MESSAGE.GARAGE_NOT_FOUND,
      GeneralResponseEnum.error,
      true,
      404
    );
  }

  if (garage.owner_id !== id) {
    return generalResponse(
      res,
      null,
      GARAGE_MESSAGE.WRONG_OWNER,
      GeneralResponseEnum.error,
      true,
      409
    );
  }

  await deleteGarage({ where: { id: garageId } });

  return generalResponse(
    res,
    null,
    GARAGE_MESSAGE.GARAGE_DELETE_SUCCESSFUL,
    GeneralResponseEnum.success,
    true,
    200
  );
});
