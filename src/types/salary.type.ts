import { Document } from "mongoose";
import { IDType } from "./requestResponse";

export interface ISalary extends Document {
  name: string;
}

// Update the interface to use IDType
export interface ISalaryUpdatePayload {
  id: IDType;
  data: Partial<ISalary>;
}
