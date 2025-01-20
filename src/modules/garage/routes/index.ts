import { Router } from "express";
import {
  addGarage,
  changeGarageStatus,
  getGarage,
  listGarages,
  listOwnerGarages,
  removeGarage,
  updateGarageDetails,
} from "../controllers";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { roleGuard } from "@/middlewares/role.middleware";
import { UserRoles } from "@/common/types";
import validationMiddleware from "@/middlewares/validation.middleware";
import { createGarageSchema, updateGarageSchema } from "../validation-schema";
import { verifyOwnerMiddleware } from "@/middlewares/owner-verification.middleware";

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
  garageRouter.get(
    `${path}/:garageId`,
    authMiddleware,
    roleGuard([UserRoles.Customer, UserRoles.Owner]),
    verifyOwnerMiddleware,
    getGarage
  );
  garageRouter.put(
    `${path}/:garageId`,
    authMiddleware,
    roleGuard([UserRoles.Owner]),
    verifyOwnerMiddleware,
    updateGarageDetails
  );
  garageRouter.delete(
    `${path}/:garageId`,
    authMiddleware,
    roleGuard([UserRoles.Owner]),
    validationMiddleware(updateGarageSchema),
    verifyOwnerMiddleware,
    removeGarage
  );
  garageRouter.put(
    `${path}/status/:garageId`,
    authMiddleware,
    roleGuard([UserRoles.Owner]),
    verifyOwnerMiddleware,
    changeGarageStatus
  );

  return garageRouter;
};

export default garageRoutes;
