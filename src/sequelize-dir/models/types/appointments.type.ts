import { TimeStampAttributes } from ".";

export enum AppointmentStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  Completed = "completed",
  Cancelled = "cancelled",
}

export interface AppointmentAttributes extends TimeStampAttributes {
  id?: number;
  garage_id: number;
  service_id: number;
  date: Date;
  start_time: string;
  end_time?: string;
  status: AppointmentStatus;
  notes?: string;
}
