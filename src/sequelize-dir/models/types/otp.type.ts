import { TimeStampAttributes } from ".";

export interface OtpAttributes extends TimeStampAttributes {
  id?: number;
  value: number;
  expiry_date: Date | string;
  user_id: number;
}
