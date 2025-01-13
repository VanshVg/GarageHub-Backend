import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  Default,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import {
  GarageAttributes,
  RequiredGarageAttributesType,
} from "./types/garages.type";
import { DataTypes } from "sequelize";
import User from "./users.model";
import City from "./cities.model";
import { GarageStatus } from "@/common/types";

@Table({
  tableName: "garages",
  timestamps: true,
  paranoid: true,
})
class Garage extends Model<GarageAttributes, RequiredGarageAttributesType> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  id: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  owner_id: number;

  @AllowNull(false)
  @Column(DataTypes.STRING)
  name: string;

  @AllowNull(true)
  @Column(DataTypes.TEXT)
  description: string;

  @AllowNull(false)
  @Column({
    type: DataTypes.STRING,
    validate: {
      is: /^[0-9]{10}$/,
    },
  })
  contact_no: string;

  @AllowNull(true)
  @Column(DataTypes.STRING)
  email: string;

  @AllowNull(false)
  @Column(DataTypes.STRING)
  address: string;

  @ForeignKey(() => City)
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  city_id: number;

  @AllowNull(false)
  @Column({ type: DataTypes.STRING, validate: { len: [6, 6] } })
  pincode: string;

  @AllowNull(false)
  @Column(DataTypes.TIME)
  start_time: string;

  @AllowNull(false)
  @Column(DataTypes.TIME)
  end_time: string;

  @AllowNull(false)
  @Default(GarageStatus.Active)
  @Column(DataTypes.ENUM(...Object.values(GarageStatus)))
  status: GarageStatus;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => User)
  user: User;
}

export default Garage;
