import { Document } from "mongoose";
import { IDType } from "./requestResponse";

export interface Igroup extends Document {
  name: string;
}

// Update the interface to use IDType
export interface IgroupUpdatePayload {
  id: IDType;
  data: Partial<Igroup>;
}
