import { UserRoles } from "@/common/types";
import { auth } from "@/middlewares/auth.middleware";
import {
  verifyGarageService,
  verifyOwner,
} from "@/middlewares/verification.middleware";
import { roleGuard } from "@/middlewares/role.middleware";
import { Router } from "express";
import {
  addServices,
  fetchGarageServices,
  updateGarageService,
} from "../controllers";

const serviceRoutes = () => {
  const path = "/service";

  const serviceRouter: Router = Router();

  serviceRouter.post(
    `${path}/:garageId`,
    auth,
    roleGuard([UserRoles.Owner]),
    verifyOwner,
    addServices
  );
  serviceRouter.get(
    `${path}/:garageId`,
    auth,
    roleGuard([UserRoles.Customer, UserRoles.Owner]),
    verifyOwner,
    fetchGarageServices
  );
  serviceRouter.put(
    `${path}/:garageId/:serviceId`,
    auth,
    roleGuard([UserRoles.Customer, UserRoles.Owner]),
    verifyOwner,
    verifyGarageService,
    updateGarageService
  );

  return serviceRouter;
};

export default serviceRoutes;
