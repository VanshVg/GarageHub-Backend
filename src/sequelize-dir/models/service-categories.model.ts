import {
  AllowNull,
  AutoIncrement,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import {
  RequiredServiceCategoryAttributesType,
  ServiceCategoryAttributes,
} from "./types/service-categories.type";
import { DataTypes } from "sequelize";
import Service from "./services.model";

@Table({
  tableName: "service_categories",
  timestamps: false,
  paranoid: false,
})
class ServiceCategory extends Model<
  ServiceCategoryAttributes,
  RequiredServiceCategoryAttributesType
> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataTypes.STRING)
  name: string;

  @AllowNull(false)
  @Column(DataTypes.STRING)
  label: string;

  @HasMany(() => Service)
  services: Service[];
}

export default ServiceCategory;
