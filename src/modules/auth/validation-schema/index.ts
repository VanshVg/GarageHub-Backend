import Joi from "joi";

import { joiCommon } from "@/common/validation-schema";
import { UserRoles } from "@/common/types";

const joiData = {
  firstName: joiCommon.joiString.max(50).label("First Name").allow("", null),
  lastName: joiCommon.joiString.max(50).label("Last Name").allow("", null),
  email: joiCommon.joiEmail.label("Email"),
  password: joiCommon.joiString.min(8).max(30).label("Password"),
};

export const signupSchema = Joi.object({
  first_name: joiData.firstName.required(),
  last_name: joiData.lastName.required(),
  email: joiData.email.required(),
  password: joiData.password.required(),
}).options({
  abortEarly: false,
});

export const updateRoleSchema = Joi.object({
  role: joiCommon.joiString
    .valid(UserRoles.Customer, UserRoles.Owner)
    .label("Role")
    .required(),
  email: joiData.email.required(),
}).options({
  abortEarly: false,
});

export const otpVerificationSchema = Joi.object({
  email: joiData.email.required(),
  otp: joiCommon.joiNumber.label("OTP").required(),
}).options({
  abortEarly: false,
});

export const loginSchema = Joi.object({
  email: joiData.email.required(),
  password: joiData.password.required(),
}).options({
  abortEarly: false,
});

export const forgotPasswordSchema = Joi.object({
  email: joiData.email.required(),
}).options({
  abortEarly: false,
});
