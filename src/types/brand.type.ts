import { Document } from "mongoose";
import { IDType } from "./requestResponse";

export interface IBrand extends Document {
  generic: IDType;
  mfr: IDType;
  name: string;
}

export interface IBrandUpdatePayload {
  id: IDType;
  data: Partial<IBrand>;
}