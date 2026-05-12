import { IDType } from "./requestResponse";

export interface IGeneric {
  id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGenericUpdatePayload {
  id: IDType;
  data: Partial<IGeneric>;
}
