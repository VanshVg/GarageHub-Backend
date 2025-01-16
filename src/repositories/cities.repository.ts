import City from "@/sequelize-dir/models/cities.model";
import { getRepository } from "./base-repository";

const CityRepo = getRepository<City>(City.name);

export const bulkCreateCities = CityRepo.bulkCreate;
export const findAllCities = CityRepo.getAll;
export const findOneCity = CityRepo.get;
