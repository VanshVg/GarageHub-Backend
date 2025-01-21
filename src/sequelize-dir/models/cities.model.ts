import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { DataTypes } from "sequelize";
import {
  CityAttributes,
  RequiredCityAttributesType,
} from "./types/cities.type";
import State from "./states.model";

@Table({
  tableName: "cities",
  timestamps: false,
  paranoid: false,
})
class City extends Model<CityAttributes, RequiredCityAttributesType> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataTypes.STRING)
  name: string;

  @ForeignKey(() => State)
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  state_id: number;

  @AllowNull(false)
  @Column(DataTypes.FLOAT)
  latitude: number;

  @AllowNull(false)
  @Column(DataTypes.FLOAT)
  longitude: number;

  @BelongsTo(() => State)
  state: State;
}

export default City;
