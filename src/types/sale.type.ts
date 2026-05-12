import { Document, Types } from "mongoose";
import { IDType } from "./requestResponse";

export interface IBatchMovement {
  batchId: Types.ObjectId | string;
  batchNumber: string;
  quantityMoved: number;
}

export interface ISaleDrugInput {
  drug: Types.ObjectId | string;
  quantity: number;
  mrp: number;
  batchMovements?: IBatchMovement[];
}

export interface ISale extends Document {
  saleAt: Date;
  drugs: ISaleDrugInput[];
  bill: number;
}

export interface ISalePayload {
  saleAt: Date;
  drugs: ISaleDrugInput[];
  bill: number;
  actor?: string;
}

export interface ISaleUpdatePayload {
  id: IDType;
  data: Partial<ISalePayload>;
}
