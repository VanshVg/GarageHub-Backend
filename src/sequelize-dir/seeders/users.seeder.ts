import { UserRoles } from "@/common/types";
import { UsersAttributes } from "../models/types/users.type";
import { createUser, findOneUser } from "@/repositories/users.repository";
import { logger } from "@/common/logger";

const userSeeder = async () => {
  try {
    const ownerData: UsersAttributes = {
      first_name: "Vansh",
      last_name: "Owner",
      email: "vansh@owner.com",
      password: "Owner@123",
      role: UserRoles.Owner,
      verified: true,
    };

    const isOwner = await findOneUser({ where: { email: ownerData.email } });
    if (!isOwner) {
      await createUser(ownerData);
    }

    const customerData: UsersAttributes = {
      first_name: "Vansh",
      last_name: "Customer",
      email: "vansh@customer.com",
      password: "Customer@123",
      role: UserRoles.Customer,
      verified: true,
    };

    const isCustomer = await findOneUser({
      where: { email: customerData.email },
    });
    if (!isCustomer) {
      await createUser(customerData);
    }
  } catch (error) {
    logger.error(`Error while running User seeder`);
  }
};

userSeeder().then(() => logger.info(`Updated user data successfully`));
