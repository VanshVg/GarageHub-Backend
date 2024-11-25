import Joi from "joi";

import { errorMessage } from "@common/types/constants";

export const joiCommon = {
  joiString: Joi.string()
    .trim()
    .messages({ ...errorMessage }),
  joiNumber: Joi.number().messages({ ...errorMessage }),
  joiBoolean: Joi.boolean().messages({ ...errorMessage }),
  joiDate: Joi.date()
    .iso()
    .messages({ ...errorMessage }),
  joiArray: Joi.array().messages({ ...errorMessage }),
  joiObject: Joi.object().messages({ ...errorMessage }),
  // ** For Pagination **
  joiPage: Joi.number()
    .messages({ ...errorMessage })
    .allow("", null),
  joiLimit: Joi.number().messages({ ...errorMessage }),
  joiFields: Joi.string()
    .messages({ ...errorMessage })
    .allow("", null),
  joiExclude: Joi.string()
    .messages({ ...errorMessage })
    .allow("", null),
  joiSort: Joi.object().messages({ ...errorMessage }),
  joiEmail: Joi.string()
    .messages({
      ...errorMessage,
      "string.email": "{#label} must be a valid email",
    })
    .email({ ignoreLength: true })
    .trim()
    .lowercase()
    .options({ convert: true }),
};
