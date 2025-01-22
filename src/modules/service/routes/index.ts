import { UserRoles } from "@/common/types";
import { auth } from "@/middlewares/auth.middleware";
import { verifyOwner } from "@/middlewares/owner-verification.middleware";
import { roleGuard } from "@/middlewares/role.middleware";
import { Router } from "express";
import { addServices } from "../controllers";

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

  return serviceRouter;
};

export default serviceRoutes;
