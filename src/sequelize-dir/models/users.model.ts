import {
  AllowNull,
  AutoIncrement,
  BeforeCreate,
  BeforeUpdate,
  Column,
  CreatedAt,
  Default,
  DeletedAt,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from "sequelize-typescript";
import {
  RequiredUserAttributesType,
  UsersAttributes,
} from "./types/users.type";
import { DataTypes, Sequelize } from "sequelize";
import argon2 from "argon2";
import Otp from "./otp.model";
import { UserRoles } from "@/common/types";

@Table({
  tableName: "users",
  timestamps: true,
  paranoid: true,
})
class User extends Model<UsersAttributes, RequiredUserAttributesType> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataTypes.STRING)
  first_name: string;

  @AllowNull(false)
  @Column(DataTypes.STRING)
  last_name: string;

  @Unique
  @AllowNull(false)
  @Column(DataTypes.STRING)
  email: string;

  @Column(DataTypes.TEXT)
  password: string;

  @Column(DataTypes.ENUM(...Object.values(UserRoles)))
  role: UserRoles;

  @Default(false)
  @Column(DataTypes.BOOLEAN)
  verified: boolean;

  @Column(DataTypes.TEXT)
  reset_pass_token: string;

  @Default(Sequelize.literal("CURRENT_TIMESTAMP"))
  @Column(DataTypes.DATE)
  last_login_date: Date;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BeforeCreate
  @BeforeUpdate
  static beforeCreateHook = async (user: User) => {
    if (user?.password && user.changed("password")) {
      user.password = await argon2.hash(user.password);
    }
    if (user?.email && user.changed("email")) {
      user.email = user.email.trim().toLowerCase();
    }
  };

  @HasMany(() => Otp)
  otps: Otp[];
}

export default User;
