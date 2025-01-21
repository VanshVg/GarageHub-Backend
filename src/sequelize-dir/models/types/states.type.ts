import { RequiredKeyType } from ".";

export interface StatesAttributes {
  id?: number;
  name: string;
}

export type RequiredStatesAttributesType = RequiredKeyType<
  StatesAttributes,
  "name"
>;
