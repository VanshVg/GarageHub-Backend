import Joi from "joi";

import { joiCommon } from "@/common/validation-schema";

const joiData = {
  firstName: joiCommon.joiString.max(50).label("First Name").allow("", null),
  lastName: joiCommon.joiString.max(50).label("Last Name").allow("", null),
  email: joiCommon.joiEmail.label("Email"),
  password: joiCommon.joiString.min(8).max(30).label("Password"),
};

export const signupSchema = Joi.object({
  firstName: joiData.firstName.required(),
  lastName: joiData.lastName.required(),
  email: joiData.email.required(),
  password: joiData.password.required(),
}).options({
  abortEarly: false,
});
