import { CITY_DATA } from "./constants";
import { logger } from "@/common/logger";
import { bulkCreateCities } from "@/repositories/cities.repository";

const citySeeder = async () => {
  try {
    await bulkCreateCities(CITY_DATA, {
      updateOnDuplicate: ["name", "latitude", "longitude"],
    });
  } catch (error) {
    logger.error(`Error while running Cities seeder`);
  }
};

citySeeder().then(() => logger.info(`Updated cities data successfully`));
