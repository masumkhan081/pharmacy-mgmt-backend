import { Document } from "mongoose";
import { IDType } from "./requestResponse";

export interface IGeneric extends Document {
  group: IDType;
  name: string;
}

// Update the interface to use IDType
export interface IGenericUpdatePayload {
  id: IDType;
  data: Partial<IGeneric>;
}
