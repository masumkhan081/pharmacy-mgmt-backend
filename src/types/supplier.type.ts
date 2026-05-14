import { IDType } from "./requestResponse";

// Aligned to Prisma `Supplier` model.
export interface ISupplier {
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface ISupplierUpdatePayload {
  id: IDType;
  data: Partial<ISupplier>;
}
