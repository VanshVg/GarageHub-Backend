import Service from "@/sequelize-dir/models/services.model";
import { getRepository } from "./base-repository";

const ServiceRepo = getRepository<Service>(Service.name);

export const findOneService = ServiceRepo.get;
export const findAllServices = ServiceRepo.getAll;
export const createServices = ServiceRepo.create;
export const updateServices = ServiceRepo.update;
export const deleteServices = ServiceRepo.deleteData;
export const bulkCreateServices = ServiceRepo.bulkCreate;
