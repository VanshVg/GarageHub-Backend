import { RequiredKeyType } from ".";

export interface ServiceCategoryAttributes {
  id?: number;
  name: string;
  label: string;
}

export type RequiredServiceCategoryAttributesType = RequiredKeyType<
  ServiceCategoryAttributes,
  "name"
>;
