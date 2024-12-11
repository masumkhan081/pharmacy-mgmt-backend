import { Document } from "mongoose";
import { IDType } from "./requestResponse";

export interface IDrug extends Document {
  generic: IDType;
  mfr: IDType;
  name: string;
}

export interface IDrugUpdatePayload {
  id: IDType;
  data: Partial<IDrug>;
}