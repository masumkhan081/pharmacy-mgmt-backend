import { IDType } from "./requestResponse";

export interface Igroup {
  id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IgroupUpdatePayload {
  id: IDType;
  data: Partial<Igroup>;
}
