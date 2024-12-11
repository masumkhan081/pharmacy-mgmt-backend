import { Document } from "mongoose";
import { IDType } from "./requestResponse";

export interface IPurchase extends Document {
  name: string;
}

// Update the interface to use IDType
export interface IPurchaseUpdatePayload {
  id: IDType;
  data: Partial<IPurchase>;
}
