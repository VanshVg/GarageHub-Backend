import { getRepository } from "./base-repository";
import Garage from "@/sequelize-dir/models/garages.model";

const GarageRepo = getRepository<Garage>(Garage.name);

export const findOneGarage = GarageRepo.get;
export const findAllGarages = GarageRepo.getAll;
export const createGarage = GarageRepo.create;
export const updateGarage = GarageRepo.update;
export const deleteGarage = GarageRepo.deleteData;
