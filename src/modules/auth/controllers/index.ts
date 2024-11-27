import { Request, Response } from "express";
import moment from "moment";

import { catchAsync } from "@/common/helper/catch-async.helper";
import { UsersAttributes } from "@/sequelize-dir/models/types/users.type";
import { createUser, findOneUser } from "@/repositories/users.repository";
import { createOtpData } from "@/repositories/otp.repository";
import { generalResponse } from "@/common/helper/response.helper";
import { AUTH_MESSAGE } from "../messages";
import { GeneralResponseEnum } from "@/common/types";

export const signup = catchAsync(async (req: Request, res: Response) => {
  const { first_name, last_name, email, password, role } =
    req.body as UsersAttributes;

  const isUser = await findOneUser({
    where: { email },
  });
  if (isUser) {
    // if (!isUser?.verified) {
    // }
  }
  const newUser = await createUser({
    first_name,
    last_name,
    email,
    password,
    role,
  });
  const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  await createOtpData({
    value: otp,
    expiry_date: moment().add(1, "hour").toISOString(),
    user_id: newUser.id,
  });

  return generalResponse(
    res,
    null,
    AUTH_MESSAGE.EMAIL_SUCCESS,
    GeneralResponseEnum.success,
    true,
    200
  );
});
