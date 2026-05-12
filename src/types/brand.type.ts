import { IDType } from "./requestResponse";

export interface IBrand {
  id?: string;
  name: string;
  origin?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBrandUpdatePayload {
  id: IDType;
  data: Partial<IBrand>;
}