import { UserRoles } from "@/common/types";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { verifyOwnerMiddleware } from "@/middlewares/owner-verification.middleware";
import { roleGuard } from "@/middlewares/role.middleware";
import { Router } from "express";
import { addServices } from "../controllers";

const serviceRoutes = () => {
  const path = "/service";

  const serviceRouter: Router = Router();

  serviceRouter.post(
    `${path}/:garageId`,
    authMiddleware,
    roleGuard([UserRoles.Owner]),
    verifyOwnerMiddleware,
    addServices
  );

  return serviceRouter;
};

export default serviceRoutes;
