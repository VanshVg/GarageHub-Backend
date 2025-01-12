import { RequiredKeyType } from ".";

export interface CityAttributes {
  id?: number;
  name: string;
  state_id: number;
  latitude: number;
  longitude: number;
}

export type RequiredCityAttributesType = RequiredKeyType<
  CityAttributes,
  "name"
>;
