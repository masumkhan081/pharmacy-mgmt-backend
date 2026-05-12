import { IDType } from "./requestResponse";

export interface IFormulation {
  id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFormulationUpdatePayload {
  id: IDType;
  data: Partial<IFormulation>;
}
