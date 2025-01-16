import {
  AllowNull,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import {
  RequiredStatesAttributesType,
  StatesAttributes,
} from "./types/states.type";
import { DataTypes } from "sequelize";
import City from "./cities.model";

@Table({
  tableName: "states",
  timestamps: false,
  paranoid: false,
})
class State extends Model<StatesAttributes, RequiredStatesAttributesType> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataTypes.STRING)
  name: string;

  @HasMany(() => City)
  cities: City[];

  readonly toJSON = () => {
    const values = Object.assign({}, this.get());
    return values;
  };
}

export default State;
