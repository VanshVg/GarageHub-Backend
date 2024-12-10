import jwt from "jsonwebtoken";

import { JWT_SECRET } from "@/config";

export const generateToken = (data: any, expireTime: number): string => {
  return jwt.sign(
    {
      data,
    },
    JWT_SECRET as string,
    { expiresIn: expireTime }
  );
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET as string);
};
