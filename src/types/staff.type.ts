import { IDType } from "./requestResponse";

// Aligned to Prisma `Staff` model.
export interface IStaff {
  name: string;
  phone?: string;
  email?: string;
  role?: string;
  salary?: number;
}

export interface IStaffUpdatePayload {
  id: IDType;
  data: Partial<IStaff>;
}
