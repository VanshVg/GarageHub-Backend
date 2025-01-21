import User from "@/sequelize-dir/models/users.model";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
