import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from "sequelize-typescript";
import { DataTypes } from "sequelize";
import { OtpAttributes } from "./types/otp.type";
import User from "./users.model";

@Table({
  tableName: "otp",
  timestamps: true,
})
class Otp extends Model<OtpAttributes> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  id: number;

  @AllowNull(false)
  @Column({ type: DataTypes.INTEGER, validate: { len: [6, 6] } })
  value: number;

  @AllowNull(false)
  @Column(DataTypes.DATE)
  expiry_date: Date | string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  user_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => User)
  user: User;

  readonly toJSON = () => {
    const values = Object.assign({}, this.get());
    return values;
  };
}

export default Otp;
