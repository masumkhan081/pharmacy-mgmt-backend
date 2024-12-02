import { IDType } from "./requestResponse";

export interface IStaff {
  fullName: string;
  phone: string;
  altPhone: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  email: string;
  designation: "admin" | "manager" | "pharmacist" | "salesman";
  address?: string;
  shift: "Morning" | "Afternoon" | "Night";
  salaryType: "Hourly" | "Weekly" | "Monthly";
  hourlySalary?: number;
  weeklySalary?: number;
  monthlySalary?: number;
  hoursPerDay: number;
  daysPerWeek: number;
  isUser?: boolean;
  isActive?: boolean;
}

// Update the interface to use IDType
export interface IStaffUpdatePayload {
  id: IDType;
  data: Partial<IStaff>;
}
