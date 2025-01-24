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
import { roleGuard } from "@/common/middlewares/role.middleware";
import { UserRoles } from "@/common/types";
import validationMiddleware from "@/common/middlewares/validation.middleware";
import { createGarageSchema, updateGarageSchema } from "../validation-schema";
import { auth } from "@/common/middlewares/auth.middleware";
import { verifyOwner } from "../middlewares";

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
