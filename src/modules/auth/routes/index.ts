import { Router } from "express";
import { signup } from "../controllers";
import validationMiddleware from "@/middlewares/validation.middleware";
import { signupSchema } from "../validation-schema";

const authRoutes = (): Router => {
  const path = "/auth";

  const authRouter: Router = Router();

  // authRouter.post(`${path}/signup`, validationMiddleware(signupSchema), signup);
  authRouter.post(`${path}/signup`, signup);

  return authRouter;
};

export default authRoutes;
