import { IDType } from "./requestResponse";

export interface ISalary {
  name: string;
}

// Update the interface to use IDType
export interface ISalaryUpdatePayload {
  id: IDType;
  data: Partial<ISalary>;
}
