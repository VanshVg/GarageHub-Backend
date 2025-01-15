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
  GaragePictureAttributes,
  GaragePictureRequiredAttributes,
} from "./types/garage-pictures.type";
import { DataTypes } from "sequelize";
import Garage from "./garages.model";

@Table({
  tableName: "garage_pictures",
  timestamps: true,
  paranoid: true,
})
class GaragePicture extends Model<
  GaragePictureAttributes,
  GaragePictureRequiredAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  id: number;

  @ForeignKey(() => Garage)
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  garage_id: number;

  @AllowNull(false)
  @Column({ type: DataTypes.STRING, validate: { isUrl: true } })
  url: string;

  @AllowNull(true)
  @Column(DataTypes.STRING)
  alt_text: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => Garage)
  garage: Garage;
}

export default GaragePicture;
