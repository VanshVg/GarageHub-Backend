// *** Packages ***
import { Request, Response } from "express";
import moment from "moment";

// *** Database ***
import { catchAsync } from "@/common/helper/catch-async.helper";
import { UsersAttributes } from "@/sequelize-dir/models/types/users.type";
import { createUser, findOneUser } from "@/repositories/users.repository";
import { createOtpData } from "@/repositories/otp.repository";

// *** Common ***
import { generalResponse } from "@/common/helper/response.helper";
import { AUTH_MESSAGE } from "../messages";
import { GeneralResponseEnum } from "@/common/types";
import {
  OTP_EMAIL_SUBJECT,
  OTP_EMAIL_TEMPLATE,
  VERIFICATION_HOURS,
} from "../types";
import { randomNumberGenerator } from "@/common/helper/number.helper";
import { sendEmail } from "@/common/helper/mail.helper";

export const signup = catchAsync(async (req: Request, res: Response) => {
  const { first_name, last_name, email, password, role } =
    req.body as UsersAttributes;

  const isUser = await findOneUser({
    where: { email },
  });

  let isUsernameAvailable = true;

  if (isUser) {
    if (!isUser?.verified) {
      const currentTime = moment();

      const verificationTime = moment(isUser.created_at);

      if (currentTime.diff(verificationTime, "hours") > 0) {
        await isUser.destroy();
      } else {
        isUsernameAvailable = false;
      }
    } else {
      isUsernameAvailable = false;
    }
  }

  if (!isUsernameAvailable) {
    return generalResponse(
      res,
      null,
      AUTH_MESSAGE.USER_EXISTS,
      GeneralResponseEnum.error,
      true,
      409
    );
  }

  const newUser = await createUser({
    first_name,
    last_name,
    email,
    password,
    role,
  });

  const otp = randomNumberGenerator(6);

  await createOtpData({
    value: otp,
    expiry_date: moment().add(VERIFICATION_HOURS, "hour").toISOString(),
    user_id: newUser.id,
  });

  sendEmail([newUser.email], OTP_EMAIL_SUBJECT, OTP_EMAIL_TEMPLATE, {
    firstName: newUser.first_name,
    lastName: newUser.last_name,
    otp: otp.toString(),
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
