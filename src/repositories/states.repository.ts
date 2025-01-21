import State from "@/sequelize-dir/models/states.model";
import { getRepository } from "./base-repository";

const StateRepo = getRepository<State>(State.name);

export const bulkCreateStates = StateRepo.bulkCreate;
export const findAllStates = StateRepo.getAll;
