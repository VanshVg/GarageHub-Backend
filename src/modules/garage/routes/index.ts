import { Router } from "express";
import {
  addGarage,
  getGarage,
  listGarages,
  listOwnerGarages,
} from "../controllers";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { roleGuard } from "@/middlewares/role.middleware";
import { UserRoles } from "@/common/types";
import validationMiddleware from "@/middlewares/validation.middleware";
import { createGarageSchema } from "../validation-schema";

const garageRoutes = () => {
  const path = "/garage";

  const garageRouter: Router = Router();

  garageRouter.post(
    `${path}`,
    authMiddleware,
    roleGuard([UserRoles.Owner]),
    validationMiddleware(createGarageSchema),
    addGarage
  );
  garageRouter.get(
    `${path}/:garageId`,
    authMiddleware,
    roleGuard([UserRoles.Customer, UserRoles.Owner]),
    getGarage
  );
  garageRouter.get(
    `${path}/list/owner`,
    authMiddleware,
    roleGuard([UserRoles.Owner]),
    listOwnerGarages
  );
  garageRouter.get(
    `${path}/list`,
    authMiddleware,
    roleGuard([UserRoles.Owner, UserRoles.Customer]),
    listGarages
  );

  return garageRouter;
};

export default garageRoutes;
