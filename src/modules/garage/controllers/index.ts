import { catchAsync } from "@/common/helper/catch-async.helper";
import { Request, Response } from "express";
import { ICreateGarageSchema } from "../types";
import User from "@/sequelize-dir/models/users.model";
import { findOneCity } from "@/repositories/cities.repository";
import { generalResponse } from "@/common/helper/response.helper";
import { GARAGE_MESSAGE } from "../messages";
import { GeneralResponseEnum } from "@/common/types";
import { createGarage } from "@/repositories/garages.repository";
import moment from "moment";

export const addGarage = catchAsync(async (req: Request, res: Response) => {
  const {
    name,
    address,
    city,
    contact_no,
    end_time,
    pincode,
    start_time,
    description,
    email,
  } = req.body as ICreateGarageSchema;

  const { id } = req.user as User;

  const cityData = await findOneCity({
    where: { name: city },
  });
  if (!cityData) {
    return generalResponse(
      res,
      null,
      GARAGE_MESSAGE.CITY_UNAVAILABLE,
      GeneralResponseEnum.error,
      true,
      401
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
