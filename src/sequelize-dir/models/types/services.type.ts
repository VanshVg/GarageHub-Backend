import { RequiredKeyType, TimeStampAttributes } from ".";

export enum DurationUnit {
  Weeks = "weeks",
  Days = "days",
  Hours = "hours",
  Minutes = "minutes",
}

export enum ServiceStatus {
  Available = "available",
  Unavailable = "unavailable",
}

export interface ServiceAttributes extends TimeStampAttributes {
  id?: number;
  category_id: number;
  garage_id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  duration_unit: DurationUnit;
}

export type RequiredServiceAttributesType = RequiredKeyType<
  ServiceAttributes,
  "name"
>;
