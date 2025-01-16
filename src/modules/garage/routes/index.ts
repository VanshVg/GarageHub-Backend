import { Router } from "express";
import { addGarage } from "../controllers";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { roleGuard } from "@/middlewares/role.middleware";
import { UserRoles } from "@/common/types";

const garageRoutes = () => {
  const path = "/garage";

  const garageRouter: Router = Router();

  garageRouter.post(
    `${path}`,
    authMiddleware,
    roleGuard(UserRoles.Owner),
    addGarage
  );

  return garageRouter;
};

export default garageRoutes;
