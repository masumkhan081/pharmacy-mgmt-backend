import { Document, Types } from "mongoose";
import { IDType } from "./requestResponse";

export interface IPurchaseDrugInput {
  drug: Types.ObjectId | string;
  quantity: number;
  purchasePrice: number;
  mrp: number;
  batchNumber: string;
  expirationDate: Date;
  batchId?: Types.ObjectId | string;
}

export interface IPurchase extends Document {
  purchaseAt: Date;
  supplier?: Types.ObjectId | string;
  drugs: IPurchaseDrugInput[];
  bill: number;
}

export interface IPurchasePayload {
  purchaseAt: Date;
  supplier?: Types.ObjectId | string;
  drugs: IPurchaseDrugInput[];
  bill: number;
  actor?: string;
}

export interface IPurchaseUpdatePayload {
  id: IDType;
  data: Partial<IPurchasePayload>;
}
