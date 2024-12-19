// *** Packages ***
import { Request, Response } from "express";
import moment from "moment";
import argon2 from "argon2";

// *** Database ***
import { catchAsync } from "@/common/helper/catch-async.helper";
import { UsersAttributes } from "@/sequelize-dir/models/types/users.type";
import { createUser, findOneUser } from "@/repositories/users.repository";
import { createOtpData, findOneOtpData } from "@/repositories/otp.repository";

// *** Common ***
import { generalResponse } from "@/common/helper/response.helper";
import { AUTH_MESSAGE } from "../messages";
import { GeneralResponseEnum } from "@/common/types";
import { IOtpVerificationBody } from "../types";
import { randomNumberGenerator } from "@/common/helper/number.helper";
import { sendEmail } from "@/common/helper/mail.helper";
import { generateToken, verifyToken } from "../helpers/token.helper";
import { logger } from "@/common/logger";
import {
  ACCESS_TOKEN_EXPIRE_TIME,
  OTP_EMAIL_SUBJECT,
  OTP_EMAIL_TEMPLATE,
  OTP_LENGTH,
  VERIFICATION_HOURS,
  VERIFICATION_JWT_EXPIRE_TIME,
} from "../types/constants";

export const signup = catchAsync(async (req: Request, res: Response) => {
  const { first_name, last_name, email, password } =
    req.body as UsersAttributes;

  const isUser = await findOneUser({
    where: { email },
  });

  let isUsernameAvailable = true;

  if (isUser) {
    if (!isUser?.verified) {
      const currentTime = moment();

      const verificationTime = moment(isUser.created_at);

      if (
        currentTime.diff(verificationTime, "hours") >
        VERIFICATION_HOURS - 1
      ) {
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

  await createUser({
    first_name,
    last_name,
    email,
    password,
  });

  return generalResponse(
    res,
    null,
    AUTH_MESSAGE.SIGNUP_SUCCESS,
    GeneralResponseEnum.success,
    false,
    200
  );
});

export const updateUserRole = catchAsync(
  async (req: Request, res: Response) => {
    const { role, email } = req.body;

    const user = await findOneUser({ where: { email } });
    if (!user) {
      return generalResponse(
        res,
        null,
        AUTH_MESSAGE.USER_NOT_FOUND,
        GeneralResponseEnum.error,
        true,
        404
      );
    }

    user.role = role;
    await user.save();

    const otp = randomNumberGenerator(OTP_LENGTH);

    await createOtpData({
      value: otp,
      expiry_date: moment().add(VERIFICATION_HOURS, "hour").toISOString(),
      user_id: user.id,
    });

    sendEmail([user.email], OTP_EMAIL_SUBJECT, OTP_EMAIL_TEMPLATE, {
      firstName: user.first_name,
      lastName: user.last_name,
      otp: otp.toString(),
    });

    return generalResponse(
      res,
      {
        token: generateToken(
          { email: user.email },
          VERIFICATION_JWT_EXPIRE_TIME
        ),
      },
      AUTH_MESSAGE.EMAIL_SUCCESS,
      GeneralResponseEnum.success,
      true,
      200
    );
  }
);

export const otpVerification = catchAsync(
  async (req: Request, res: Response) => {
    const { otp } = req.body as IOtpVerificationBody;

    const { auth } = req.query;

    let decodedData: { data: { email: string } };

    try {
      decodedData = await verifyToken(auth as string);
    } catch (error) {
      logger.error(JSON.stringify(error, undefined, 1));

      return generalResponse(
        res,
        null,
        AUTH_MESSAGE.INVALID_TOKEN,
        GeneralResponseEnum.error,
        true,
        401
      );
    }

    const user = await findOneUser({
      where: { email: decodedData?.data?.email },
    });

    if (!user) {
      return generalResponse(
        res,
        null,
        AUTH_MESSAGE.USER_NOT_FOUND,
        GeneralResponseEnum.error,
        true,
        404
      );
    }

    const userOtp = await findOneOtpData({
      where: { user_id: user.id },
    });

    if (userOtp?.value !== otp) {
      return generalResponse(
        res,
        null,
        AUTH_MESSAGE.INVALID_OTP,
        GeneralResponseEnum.error,
        true,
        400
      );
    }

    if (moment().isAfter(userOtp?.expiry_date)) {
      await userOtp.destroy();

      return generalResponse(
        res,
        null,
        AUTH_MESSAGE.OTP_EXPIRED,
        GeneralResponseEnum.error,
        true,
        400
      );
    }

    user.verified = true;
    await user.save();

    return generalResponse(
      res,
      null,
      AUTH_MESSAGE.VERIFIED_SUCCESS,
      GeneralResponseEnum.success,
      true,
      200
    );
  }
);

export const resendOtp = catchAsync(async (req: Request, res: Response) => {
  const { auth } = req.query;

  let decodedData: { data: { email: string } };

  try {
    decodedData = await verifyToken(auth as string);
  } catch (error) {
    logger.error(JSON.stringify(error, undefined, 1));

    return generalResponse(
      res,
      null,
      AUTH_MESSAGE.INVALID_TOKEN,
      GeneralResponseEnum.error,
      true,
      401
    );
  }

  const user = await findOneUser({
    where: { email: decodedData?.data?.email },
  });

  if (!user) {
    return generalResponse(
      res,
      null,
      AUTH_MESSAGE.USER_NOT_FOUND,
      GeneralResponseEnum.error,
      true,
      404
    );
  }

  const userOtp = await findOneOtpData({
    where: { user_id: user.id },
  });

  const otp = randomNumberGenerator(OTP_LENGTH);

  if (userOtp) {
    userOtp.value = otp;
    userOtp.expiry_date = moment()
      .add(VERIFICATION_HOURS, "hour")
      .toISOString();

    await userOtp.save();
  } else {
    await createOtpData({
      value: otp,
      expiry_date: moment().add(VERIFICATION_HOURS, "hour").toISOString(),
      user_id: user.id,
    });
  }

  sendEmail([user.email], OTP_EMAIL_SUBJECT, OTP_EMAIL_TEMPLATE, {
    firstName: user.first_name,
    lastName: user.last_name,
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

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body as UsersAttributes;

  const user = await findOneUser({
    where: { email },
  });
  if (!user) {
    return generalResponse(
      res,
      null,
      AUTH_MESSAGE.INVALID_CREDENTIALS,
      GeneralResponseEnum.error,
      true,
      404
    );
  }
  if (!user.verified) {
    return generalResponse(
      res,
      null,
      AUTH_MESSAGE.NOT_ACTIVATED,
      GeneralResponseEnum.error,
      true,
      404
    );
  }

  const passwordResult = await argon2.verify(user.password, password);
  if (!passwordResult) {
    return generalResponse(
      res,
      null,
      AUTH_MESSAGE.INVALID_CREDENTIALS,
      GeneralResponseEnum.error,
      true,
      404
    );
  }

  const accessToken = generateToken(
    { email: user.email, role: user.role },
    ACCESS_TOKEN_EXPIRE_TIME
  );

  user.last_login_date = moment().toDate();
  await user.save();

  return generalResponse(
    res,
    {
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    },
    AUTH_MESSAGE.LOGIN_SUCCESS,
    GeneralResponseEnum.success,
    true,
    200
  );
});

export const forgotPassword = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await findOneUser({ where: { email } });
    if (!user) {
      return generalResponse(
        res,
        null,
        AUTH_MESSAGE.USER_NOT_FOUND,
        GeneralResponseEnum.error,
        true,
        404
      );
    }

    if (!user.verified) {
      return generalResponse(
        res,
        null,
        AUTH_MESSAGE.NOT_ACTIVATED,
        GeneralResponseEnum.error,
        true,
        404
      );
    }

    const otp = randomNumberGenerator(OTP_LENGTH);

    const otpData = await findOneOtpData({
      where: { user_id: user.id },
    });
    if (otpData) {
      otpData.value = otp;
      otpData.expiry_date = moment()
        .add(VERIFICATION_HOURS, "hour")
        .toISOString();

      await otpData.save();
    } else {
      await createOtpData({
        value: otp,
        expiry_date: moment().add(VERIFICATION_HOURS, "hour").toISOString(),
        user_id: user.id,
      });
    }
    sendEmail([user.email], OTP_EMAIL_SUBJECT, OTP_EMAIL_TEMPLATE, {
      firstName: user.first_name,
      lastName: user.last_name,
      otp: otp.toString(),
    });

    return generalResponse(
      res,
      {
        token: generateToken(
          { email: user.email },
          VERIFICATION_JWT_EXPIRE_TIME
        ),
      },
      AUTH_MESSAGE.EMAIL_SUCCESS,
      GeneralResponseEnum.success,
      true,
      200
    );
  }
);
