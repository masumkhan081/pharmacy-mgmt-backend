import { Document } from "mongoose";
import { IDType } from "./requestResponse";

export interface IFormulation extends Document {
  name: string;
}

// Update the interface to use IDType
export interface IFormulationUpdatePayload {
  id: IDType;
  data: Partial<IFormulation>;
}
