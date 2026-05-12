import { IDType } from "./requestResponse";

export interface IUnit {
  id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUnitUpdatePayload {
  id: IDType;
  data: Partial<IUnit>;
}
