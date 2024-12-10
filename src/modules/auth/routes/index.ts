import { Router } from "express";
import { otpVerification, signup } from "../controllers";
import validationMiddleware from "@/middlewares/validation.middleware";
import { otpVerificationSchema, signupSchema } from "../validation-schema";

const authRoutes = (): Router => {
  const path = "/auth";

  const authRouter: Router = Router();

  authRouter.post(`${path}/signup`, validationMiddleware(signupSchema), signup);
  authRouter.post(
    `${path}/verify-otp`,
    validationMiddleware(otpVerificationSchema),
    otpVerification
  );

  return authRouter;
};

export default authRoutes;
