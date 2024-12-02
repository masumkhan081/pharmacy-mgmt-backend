import { Document } from "mongoose";
import { IDType } from "./requestResponse";

export interface IManufacturer extends Document {
  name: string;
}

// Update the interface to use IDType
export interface IManufacturerUpdatePayload {
  id: IDType;
  data: Partial<IManufacturer>;
}
