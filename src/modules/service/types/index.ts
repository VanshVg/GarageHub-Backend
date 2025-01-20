import { DurationUnit } from "@/sequelize-dir/models/types/services.type";

export interface ICreateServiceBody {
  category: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  duration_unit: DurationUnit;
}
