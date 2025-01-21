import { bulkCreateServiceCategories } from "@/repositories/service-categories.repository";
import { SERVICE_CATEGORY_DATA } from "./constants";
import { logger } from "@/common/logger";

const serviceCategorySeeder = async () => {
  try {
    await bulkCreateServiceCategories(SERVICE_CATEGORY_DATA, {
      updateOnDuplicate: ["name", "label"],
    });
  } catch (error) {
    logger.error(`Error while running Service Category seeder`);
  }
};

serviceCategorySeeder().then(() =>
  logger.info(`Updated Service Category data successfully`)
);
