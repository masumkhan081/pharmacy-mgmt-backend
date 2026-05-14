import { IDType } from "./requestResponse";

export interface IBatchMovement {
  batchId: IDType;
  batchNumber: string;
  quantityMoved: number;
}

export interface ISaleDrugInput {
  drug: IDType;
  quantity: number;
  mrp: number;
  batchMovements?: IBatchMovement[];
}

export interface ISale {
  saleAt: Date;
  drugs: ISaleDrugInput[];
  bill: number;
}

export interface ISalePayload {
  saleAt?: Date;
  drugs: ISaleDrugInput[];
  bill: number;
  customerId?: string;
  actor?: string;
}

export interface ISaleUpdatePayload {
  id: IDType;
  data: Partial<ISalePayload>;
}
