import { Document } from "mongoose";
import { IDType } from "./requestResponse";

export interface IUnit extends Document {
  name: string;
}

// Update the interface to use IDType
export interface IUnitUpdatePayload {
  id: IDType;
  data: Partial<IUnit>;
}
