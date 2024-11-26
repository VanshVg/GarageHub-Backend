import Otp from "@/sequelize-dir/models/otp.model";
import { getRepository } from "./base-repository";

const OtpRepo = getRepository<Otp>(Otp.name);

export const findOneOtpData = OtpRepo.get;
export const findAllOtpData = OtpRepo.getAll;
export const createOtpData = OtpRepo.create;
export const updateOtpData = OtpRepo.update;
export const deleteOtpData = OtpRepo.deleteData;
