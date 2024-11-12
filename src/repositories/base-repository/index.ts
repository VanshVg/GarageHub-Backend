import _ from "lodash";
import { Model, ModelCtor } from "sequelize-typescript";
import { Optional, QueryOptions } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import db from "@/sequelize-dir/models";

import {
  CountArgsType,
  CreateOneOptionsType,
  DeleteArgsType,
  FindAllArgsType,
  FindOneArgsType,
  RestoreArgsType,
  UpdateOneArgsType,
  UpdateOneOptionsType,
  CreateArgsType,
  BulkCreateArgsType,
  BulkCreateOptionsType,
  UpsertOptionsType,
  FindAndCountAllArgsType,
} from "./types";

export const getRepository = <M extends Model>(modelName: string) => {
  const DBModel = <ModelCtor<M>>db.models[modelName];
  const cancelQueryError = "CancelQueryError";

  const get = async (data: Optional<FindOneArgsType<M>, "rejectOnEmpty">) => {
    return DBModel.findOne({ ...data, rejectOnEmpty: false });
  };

  const getAll = async (data: FindAllArgsType<M>) => {
    return DBModel.findAll({ ...data });
  };

  const create = async (
    data: CreateArgsType<M>,
    options?: CreateOneOptionsType<M>
  ) => {
    return DBModel.create(data, { ...options, returning: true });
  };

  const getCount = async (options?: CountArgsType<M>) => {
    return DBModel.count(options);
  };

  const bulkCreate = async (
    data: BulkCreateArgsType<M>,
    options?: BulkCreateOptionsType<M>
  ) => {
    return DBModel.bulkCreate(data, options);
  };

  const update = async (
    data: UpdateOneArgsType<M>,
    options?: Optional<UpdateOneOptionsType<M>, "returning">
  ) => {
    return DBModel.update(data, {
      returning: true,
      individualHooks: true,
      ...options,
    });
  };

  const upsert = async (
    data: CreateArgsType<M>,
    options?: UpsertOptionsType<M>
  ) => {
    return DBModel.upsert(data, { returning: true, ...options });
  };

  const deleteData = async (options: DeleteArgsType<M>) => {
    return DBModel.destroy(options);
  };

  const restore = async (options: RestoreArgsType<M>) => {
    return DBModel.restore(options);
  };

  const getAllData = async (options?: FindAndCountAllArgsType<M>) => {
    return DBModel.findAndCountAll({ ...options, distinct: true });
  };

  const getSQLFromFindAll = async (
    options: FindAllArgsType<M>,
    action: "findAll" | "count" = "findAll"
  ) => {
    return new Promise<{
      sql: string;
      options: QueryOptions & { [key: string]: any };
    }>(async (resolve, reject) => {
      const id = uuidv4();
      const hookName =
        action === "findAll" ? "beforeFindAfterOptions" : "beforeCount";
      DBModel.addHook(
        hookName,
        id,
        (hookOptions: QueryOptions & { getGeneratedQueryOnly?: true }) => {
          // if this query is not about generating raw sql, pass it through
          if (!hookOptions.getGeneratedQueryOnly) {
            return;
          }
          DBModel.removeHook(hookName, id);
          resolve({
            sql: (DBModel.sequelize as any).dialect.queryGenerator
              .selectQuery(
                DBModel.getTableName(),
                _.omit(hookOptions, "getGeneratedQueryOnly"),
                DBModel
              )
              .slice(0, -1),
            options: hookOptions,
          });
          // Throw error to cancel query execution
          throw new Error(cancelQueryError);
        }
      );
      return DBModel?.[action]({
        ...options,
        getGeneratedQueryOnly: true,
      } as any).catch((e) => {
        if (e.message === cancelQueryError) {
          // this is expected, so ignore the error
        } else {
          reject(e);
        }
      });
    });
  };

  return {
    DBModel,
    get,
    getAll,
    getCount,
    getAllData,
    create,
    update,
    deleteData,
    restore,
    getSQLFromFindAll,
    upsert,
    bulkCreate,
  };
};
