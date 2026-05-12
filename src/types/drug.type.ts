import { IDType } from "./requestResponse";

export type DrugStatus = "ACTIVE" | "INACTIVE";

export interface IDrug {
  id: string;
  name: string;
  brandId: string;
  formulationId: string;
  strength: number;
  unitId: string;
  available: number;
  purchasePrice: number;
  mrp: number;
  status: DrugStatus;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDrugCreateInput {
  name: string;
  brandId: string;
  formulationId: string;
  strength: number;
  unitId: string;
  available?: number;
  purchasePrice: number;
  mrp: number;
  status?: DrugStatus;
}

export interface IDrugUpdateInput {
  name?: string;
  brandId?: string;
  formulationId?: string;
  strength?: number;
  unitId?: string;
  available?: number;
  purchasePrice?: number;
  mrp?: number;
  status?: DrugStatus;
  isDeleted?: boolean;
}

export interface IDrugUpdatePayload {
  id: string;
  data: IDrugUpdateInput;
}