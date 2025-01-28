import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import {
  DurationUnit,
  RequiredServiceAttributesType,
  ServiceAttributes,
  ServiceStatus,
} from "./types/services.type";
import { DataTypes } from "sequelize";
import ServiceCategory from "./service-categories.model";
import Garage from "./garages.model";

@Table({
  tableName: "services",
  timestamps: true,
  paranoid: true,
})
class Service extends Model<ServiceAttributes, RequiredServiceAttributesType> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  id: number;

  @ForeignKey(() => ServiceCategory)
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  category_id: number;

  @ForeignKey(() => Garage)
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  garage_id: number;

  @AllowNull(false)
  @Column(DataTypes.STRING)
  name: string;

  @AllowNull(true)
  @Column(DataTypes.TEXT)
  description: string;

  @AllowNull(false)
  @Column(DataTypes.DECIMAL(10, 2))
  price: number;

  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  duration: number;

  @AllowNull(false)
  @Column(DataTypes.ENUM(...Object.values(DurationUnit)))
  duration_unit: DurationUnit;

  @AllowNull(false)
  @Column(DataTypes.ENUM(...Object.values(ServiceStatus)))
  status: ServiceStatus;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => ServiceCategory)
  category: ServiceCategory;

  @BelongsTo(() => Garage)
  garage: Garage;

  readonly toJSON = () => {
    const values = Object.assign({}, this.get());
    return values;
  };
}

export default Service;
