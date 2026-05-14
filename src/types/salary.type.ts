import { IDType } from "./requestResponse";

export interface ISalary {
  staff: IDType;
  amount: number;
  month: string;
  year: number;
  paidAt?: Date;
}

export interface ISalaryUpdatePayload {
  id: IDType;
  data: Partial<ISalary>;
}
