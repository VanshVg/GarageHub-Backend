import { Router } from "express";
import { otpVerification, resendOtp, signup } from "../controllers";
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
  authRouter.post(`${path}/resend-otp`, resendOtp);

  return authRouter;
};

export default authRoutes;
