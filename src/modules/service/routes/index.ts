import { UserRoles } from "@/common/types";
import { auth } from "@/middlewares/auth.middleware";
import { verifyOwner } from "@/middlewares/owner-verification.middleware";
import { roleGuard } from "@/middlewares/role.middleware";
import { Router } from "express";
import { addServices, fetchGarageServices } from "../controllers";

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

  return serviceRouter;
};

export default serviceRoutes;
