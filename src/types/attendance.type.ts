import { IDType } from "./requestResponse";

export interface IAttendance {
  staff: IDType;
  status: string;
  date?: Date;
}

export interface IAttendanceUpdatePayload {
  id: IDType;
  data: Partial<IAttendance>;
}
