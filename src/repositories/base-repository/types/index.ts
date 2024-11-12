import {
  Attributes,
  CountOptions,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  NonNullFindOptions,
  RestoreOptions,
  UpdateOptions,
  BulkCreateOptions as BulkCreateOptionsAlias,
  FindAndCountOptions,
  UpsertOptions as UpsertOptionsAlias,
} from "sequelize";
import { Model } from "sequelize-typescript";
import { Col, Fn, Literal } from "sequelize/types/utils";

export type FindOneArgsType<M extends Model> = NonNullFindOptions<
  Attributes<M>
>;

export type FindAllArgsType<M extends Model> = FindOptions<Attributes<M>>;

export type CreateArgsType<M extends Model> = CreationAttributes<M>;

export type BulkCreateArgsType<M extends Model> = ReadonlyArray<
  CreationAttributes<M>
>;

export type BulkCreateOptionsType<M extends Model> = BulkCreateOptionsAlias<
  Attributes<M>
>;

export type FindAndCountAllArgsType<M extends Model> = Omit<
  FindAndCountOptions<Attributes<M>>,
  "group"
>;

export type CreateOneOptionsType<M extends Model> = CreateOptions<
  Attributes<M>
>;

export type UpdateOneArgsType<M extends Model> = {
  [key in keyof Attributes<M>]?: Attributes<M>[key] | Fn | Col | Literal;
};

export type UpdateOneOptionsType<M extends Model> = Omit<
  UpdateOptions<Attributes<M>>,
  "returning"
> & {
  returning: Exclude<
    UpdateOptions<Attributes<M>>["returning"],
    undefined | false
  >;
};

export type UpsertOptionsType<M extends Model> = UpsertOptionsAlias<
  Attributes<M>
>;

export type DeleteArgsType<M extends Model> = DestroyOptions<Attributes<M>>;

export type RestoreArgsType<M extends Model> = RestoreOptions<Attributes<M>>;

export type CountArgsType<M extends Model> = CountOptions<Attributes<M>>;
