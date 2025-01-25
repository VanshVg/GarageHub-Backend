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
import { garageAuth, userAuth } from "@/common/middlewares/auth.middleware";

const garageRoutes = () => {
  const path = "/garage";

  const garageRouter: Router = Router();

  garageRouter.post(
    `${path}`,
    userAuth,
    roleGuard([UserRoles.Owner]),
    validationMiddleware(createGarageSchema),
    addGarage
  );
  garageRouter.get(
    `${path}/list/owner`,
    userAuth,
    roleGuard([UserRoles.Owner]),
    listOwnerGarages
  );
  garageRouter.get(
    `${path}/list`,
    userAuth,
    roleGuard([UserRoles.Owner, UserRoles.Customer]),
    listGarages
  );
  garageRouter.get(
    `${path}/:garageId`,
    userAuth,
    roleGuard([UserRoles.Customer, UserRoles.Owner]),
    garageAuth,
    getGarage
  );
  garageRouter.put(
    `${path}/:garageId`,
    userAuth,
    roleGuard([UserRoles.Owner]),
    garageAuth,
    updateGarageDetails
  );
  garageRouter.delete(
    `${path}/:garageId`,
    userAuth,
    roleGuard([UserRoles.Owner]),
    validationMiddleware(updateGarageSchema),
    garageAuth,
    removeGarage
  );
  garageRouter.put(
    `${path}/status/:garageId`,
    userAuth,
    roleGuard([UserRoles.Owner]),
    garageAuth,
    changeGarageStatus
  );

  return garageRouter;
};

export default garageRoutes;
