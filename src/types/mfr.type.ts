import { IDType } from "./requestResponse";

export interface IManufacturer {
  id?: string;
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IManufacturerUpdatePayload {
  id: IDType;
  data: Partial<IManufacturer>;
}
