export const VERIFICATION_HOURS = 1;

export const OTP_LENGTH = 6;

export const OTP_EMAIL_SUBJECT = "Garage Hub OTP Verification";

export const OTP_EMAIL_TEMPLATE = "otp";

export interface IOtpVerificationBody {
  email: string;
  otp: number;
}
