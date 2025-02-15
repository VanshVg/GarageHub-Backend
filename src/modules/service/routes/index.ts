import { UserRoles } from "@/common/types";
import { roleGuard } from "@/common/middlewares/role.middleware";
import { Router } from "express";
import {
  addServices,
  changeServiceStatus,
  fetchGarageServices,
  removeGarageService,
  updateGarageService,
} from "../controllers";
import {
  garageAuth,
  serviceAuth,
  userAuth,
} from "@/common/middlewares/auth.middleware";

const serviceRoutes = () => {
  const path = "/service";

  const serviceRouter: Router = Router();

  serviceRouter.post(
    `${path}/:garageId`,
    userAuth,
    roleGuard([UserRoles.Owner]),
    garageAuth,
    addServices
  );
  serviceRouter.get(
    `${path}/:garageId`,
    userAuth,
    roleGuard([UserRoles.Customer, UserRoles.Owner]),
    garageAuth,
    fetchGarageServices
  );
  serviceRouter.put(
    `${path}/:serviceId`,
    userAuth,
    roleGuard([UserRoles.Customer, UserRoles.Owner]),
    serviceAuth,
    updateGarageService
  );
  serviceRouter.put(
    `${path}/status/:serviceId`,
    userAuth,
    roleGuard([UserRoles.Owner]),
    serviceAuth,
    changeServiceStatus
  );
  serviceRouter.delete(
    `${path}/:serviceId`,
    userAuth,
    roleGuard([UserRoles.Owner]),
    serviceAuth,
    removeGarageService
  );

  return serviceRouter;
};

export default serviceRoutes;
