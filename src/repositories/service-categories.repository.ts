import ServiceCategory from "@/sequelize-dir/models/service-categories.model";
import { getRepository } from "./base-repository";

const ServiceCategoryRepo = getRepository<ServiceCategory>(
  ServiceCategory.name
);

export const findOneServiceCategory = ServiceCategoryRepo.get;
export const findAllServiceCategories = ServiceCategoryRepo.getAll;
export const createServiceCategory = ServiceCategoryRepo.create;
export const updateServiceCategory = ServiceCategoryRepo.update;
export const deleteServiceCategory = ServiceCategoryRepo.deleteData;
export const bulkCreateServiceCategories = ServiceCategoryRepo.bulkCreate;
