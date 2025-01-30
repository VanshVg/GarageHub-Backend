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
  AppointmentAttributes,
  AppointmentStatus,
} from "./types/appointments.type";
import { DataTypes } from "sequelize";
import Garage from "./garages.model";
import User from "./users.model";
import Service from "./services.model";

@Table({
  tableName: "appointments",
  timestamps: true,
  paranoid: true,
})
class Appointment extends Model<AppointmentAttributes> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  id: number;

  @ForeignKey(() => Garage)
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  garage_id: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  customer_id: number;

  @AllowNull(false)
  @Column(DataTypes.DATE)
  date: Date;

  @AllowNull(false)
  @Column(DataTypes.TIME)
  start_time: string;

  @AllowNull(false)
  @Column(DataTypes.TIME)
  end_time: string;

  @AllowNull(false)
  @Column(DataTypes.ENUM(...Object.keys(AppointmentStatus)))
  status: AppointmentStatus;

  @AllowNull(false)
  @Column(DataTypes.TEXT)
  notes: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => Garage)
  garage: Garage;

  @BelongsTo(() => Service)
  service: Service;

  readonly toJSON = () => {
    const values = Object.assign({}, this.get());
    return values;
  };
}

export default Appointment;
