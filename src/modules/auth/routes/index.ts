import { Router } from "express";
import { login, otpVerification, resendOtp, signup } from "../controllers";
import validationMiddleware from "@/middlewares/validation.middleware";
import {
  loginSchema,
  otpVerificationSchema,
  signupSchema,
} from "../validation-schema";

const authRoutes = (): Router => {
  const path = "/auth";

  const authRouter: Router = Router();

  authRouter.post(`${path}/signup`, validationMiddleware(signupSchema), signup);
  authRouter.post(
    `${path}/verify-otp`,
    validationMiddleware(otpVerificationSchema),
    otpVerification
  );
  authRouter.post(`${path}/resend-otp`, resendOtp);
  authRouter.post(`${path}/login`, validationMiddleware(loginSchema), login);

  return authRouter;
};

export default authRoutes;
