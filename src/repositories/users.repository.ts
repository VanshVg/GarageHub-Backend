import User from "@/sequelize-dir/models/users.model";
import { getRepository } from "./base-repository";

const UserRepo = getRepository<User>(User.name);

export const findOneUser = UserRepo.get;
export const findAllUsers = UserRepo.getAll;
export const createUser = UserRepo.create;
export const updateUser = UserRepo.update;
export const deleteUser = UserRepo.deleteData;
