import { GarageStatus } from "@/common/types";
import { RequiredKeyType, TimeStampAttributes } from ".";

export interface GarageAttributes extends TimeStampAttributes {
  id?: number;
  owner_id: number;
  name: string;
  description?: string;
  contact_no: string;
  email?: string;
  address: string;
  city_id: number;
  pincode: string;
  start_time: string;
  end_time: string;
  status: GarageStatus;
}

export type RequiredGarageAttributesType = RequiredKeyType<
  GarageAttributes,
  "email"
>;
