import { IDType } from "./requestResponse";

export interface IPurchaseDrugInput {
  drug: IDType;
  quantity: number;
  purchasePrice: number;
  mrp: number;
  batchNumber: string;
  expirationDate: Date;
  batchId?: IDType;
}

export interface IPurchase {
  purchaseAt: Date;
  supplier?: IDType;
  drugs: IPurchaseDrugInput[];
  bill: number;
}

export interface IPurchasePayload {
  purchaseAt: Date;
  supplier?: IDType;
  drugs: IPurchaseDrugInput[];
  bill: number;
  actor?: string;
}

export interface IPurchaseUpdatePayload {
  id: IDType;
  data: Partial<IPurchasePayload>;
}
