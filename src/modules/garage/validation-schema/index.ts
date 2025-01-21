import { joiCommon } from "@/common/validation-schema";
import Joi from "joi";

const joiData = {
  name: joiCommon.joiString.max(50).label("Garage Name").allow("", null),
  description: joiCommon.joiString.max(50).label("Description").allow("", null),
  contact_no: joiCommon.joiString.label("Contact No."),
  email: joiCommon.joiEmail.label("Email").allow("", null),
  address: joiCommon.joiString.label("Address"),
  city: joiCommon.joiString.label("City"),
  pincode: joiCommon.joiString.label("Pincode"),
  start_time: joiCommon.joiString.label("Garage start time"),
  end_time: joiCommon.joiString.label("Garage end time"),
};

export const createGarageSchema = Joi.object({
  name: joiData.name.required(),
  description: joiData.description,
  contact_no: joiData.contact_no.required(),
  email: joiData.email,
  address: joiData.address.required(),
  city: joiData.city.required(),
  pincode: joiData.pincode.required(),
  start_time: joiData.start_time.required(),
  end_time: joiData.end_time.required(),
}).options({
  abortEarly: false,
});

export const updateGarageSchema = Joi.object({
  name: joiData.name,
  description: joiData.description,
  contact_no: joiData.contact_no,
  email: joiData.email,
  address: joiData.address,
  city: joiData.city,
  pincode: joiData.pincode,
  start_time: joiData.start_time,
  end_time: joiData.end_time,
}).options({
  abortEarly: false,
});
