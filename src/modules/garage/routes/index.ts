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
import { roleGuard } from "@/middlewares/role.middleware";
import { UserRoles } from "@/common/types";
import validationMiddleware from "@/middlewares/validation.middleware";
import { createGarageSchema, updateGarageSchema } from "../validation-schema";
import { verifyOwner } from "@/middlewares/verification.middleware";
import { auth } from "@/middlewares/auth.middleware";

const garageRoutes = () => {
  const path = "/garage";

  const garageRouter: Router = Router();

  garageRouter.post(
    `${path}`,
    auth,
    roleGuard([UserRoles.Owner]),
    validationMiddleware(createGarageSchema),
    addGarage
  );
  garageRouter.get(
    `${path}/list/owner`,
    auth,
    roleGuard([UserRoles.Owner]),
    listOwnerGarages
  );
  garageRouter.get(
    `${path}/list`,
    auth,
    roleGuard([UserRoles.Owner, UserRoles.Customer]),
    listGarages
  );
  garageRouter.get(
    `${path}/:garageId`,
    auth,
    roleGuard([UserRoles.Customer, UserRoles.Owner]),
    verifyOwner,
    getGarage
  );
  garageRouter.put(
    `${path}/:garageId`,
    auth,
    roleGuard([UserRoles.Owner]),
    verifyOwner,
    updateGarageDetails
  );
  garageRouter.delete(
    `${path}/:garageId`,
    auth,
    roleGuard([UserRoles.Owner]),
    validationMiddleware(updateGarageSchema),
    verifyOwner,
    removeGarage
  );
  garageRouter.put(
    `${path}/status/:garageId`,
    auth,
    roleGuard([UserRoles.Owner]),
    verifyOwner,
    changeGarageStatus
  );

  return garageRouter;
};

export default garageRoutes;
