import { UserRoles } from "@/common/types/index";
import { RequiredKeyType, TimeStampAttributes } from ".";

export interface UsersAttributes extends TimeStampAttributes {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role?: UserRoles;
  verified: boolean;
  reset_pass_token: string;
  last_login_date?: Date | string;
}

export type RequiredUserAttributesType = RequiredKeyType<
  UsersAttributes,
  "email"
>;
