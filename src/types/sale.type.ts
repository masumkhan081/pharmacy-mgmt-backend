import { Document } from "mongoose";
import { IDType } from "./requestResponse";

export interface ISale extends Document {
  name: string;
}

// Update the interface to use IDType
export interface ISaleUpdatePayload {
  id: IDType;
  data: Partial<ISale>;
}
