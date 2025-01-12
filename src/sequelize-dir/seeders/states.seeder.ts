import { bulkCreateStates } from "@/repositories/states.repository";
import { STATE_DATA } from "./constants";
import { logger } from "@/common/logger";

const stateSeeder = async () => {
  try {
    await bulkCreateStates(STATE_DATA, { updateOnDuplicate: ["name"] });
  } catch (error) {
    logger.error(`Error while running States seeder`);
  }
};

stateSeeder().then(() => logger.info(`Updated states data successfully`));
