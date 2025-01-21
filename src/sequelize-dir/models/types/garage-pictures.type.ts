import { RequiredKeyType, TimeStampAttributes } from ".";

export interface GaragePictureAttributes extends TimeStampAttributes {
  id?: number;
  garage_id: number;
  url: string;
  alt_text: string;
}

export type GaragePictureRequiredAttributes = RequiredKeyType<
  GaragePictureAttributes,
  "url"
>;
