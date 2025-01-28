import { Router } from "express";
import {
  forgotPassword,
  login,
  otpVerification,
  resendOtp,
  resetPassword,
  signup,
  updateUserRole,
} from "../controllers";
import validationMiddleware from "@/common/middlewares/validation.middleware";
import {
  forgotPasswordSchema,
  loginSchema,
  otpVerificationSchema,
  resetPasswordSchema,
  signupSchema,
  updateRoleSchema,
} from "../validation-schema";

const authRoutes = (): Router => {
  const path = "/auth";

  const authRouter: Router = Router();

  authRouter.post(`${path}/signup`, validationMiddleware(signupSchema), signup);
  authRouter.post(
    `${path}/update-role`,
    validationMiddleware(updateRoleSchema),
    updateUserRole
  );
  authRouter.post(
    `${path}/verify-otp`,
    validationMiddleware(otpVerificationSchema),
    otpVerification
  );
  authRouter.post(`${path}/resend-otp`, resendOtp);
  authRouter.post(`${path}/login`, validationMiddleware(loginSchema), login);
  authRouter.post(
    `${path}/forgot-password`,
    validationMiddleware(forgotPasswordSchema),
    forgotPassword
  );
  authRouter.post(
    `${path}/reset-password`,
    validationMiddleware(resetPasswordSchema),
    resetPassword
  );

  return authRouter;
};

export default authRoutes;
