import { IDType } from "./requestResponse";

export interface ISupplier {
  fullName: string;
  phone: string;
  altPhone: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  email: string;
  manufacturer: string; // Adjust type based on manufacturer reference
  address: string;
  deliveryFrequency: "Daily" | "Weekly" | "Monthly" | "On-demand";
  isActive: boolean;
  notes: string;
}

export interface ISupplierUpdatePayload {
  id: IDType;
  data: Partial<ISupplier>;
}
