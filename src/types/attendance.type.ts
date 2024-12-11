import { Document } from "mongoose";
import { IDType } from "./requestResponse";

export interface IAttendance extends Document {
  name: string;
}

// Update the interface to use IDType
export interface IAttendanceUpdatePayload {
  id: IDType;
  data: Partial<IAttendance>;
}
