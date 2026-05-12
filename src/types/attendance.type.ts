import { IDType } from "./requestResponse";

export interface IAttendance {
  name: string;
}

// Update the interface to use IDType
export interface IAttendanceUpdatePayload {
  id: IDType;
  data: Partial<IAttendance>;
}
