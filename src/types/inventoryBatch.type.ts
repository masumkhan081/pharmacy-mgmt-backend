export type BatchStatus = "AVAILABLE" | "LOW_STOCK" | "OUT_OF_STOCK" | "EXPIRED" | "RECALLED";

export interface IInventoryBatch {
  id: string;
  drugId: string;
  batchNumber: string;
  lotNumber?: string | null;
  expirationDate: Date;
  initialQuantity: number;
  currentQuantity: number;
  purchasePrice: number;
  sellingPrice: number;
  purchaseId?: string | null;
  status: BatchStatus;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInventoryBatchCreateInput {
  drugId: string;
  batchNumber: string;
  lotNumber?: string;
  expirationDate: Date;
  initialQuantity: number;
  currentQuantity: number;
  purchasePrice: number;
  sellingPrice: number;
  purchaseId?: string;
  status?: BatchStatus;
  isActive?: boolean;
}

export interface IInventoryBatchUpdateInput {
  currentQuantity?: number;
  status?: BatchStatus;
  isActive?: boolean;
}
