export type InventoryUnit = 'un' | 'ml' | 'g' | 'cm' | 'par';
export type MovementType = 'IN' | 'OUT';
export type MovementReason = 'PURCHASE' | 'USAGE' | 'LOSS' | 'ADJUSTMENT' | 'OTHER';
export type PurchasePaymentType = 'CASH' | 'INVOICE';
export type InventoryStatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';

export interface InventoryItem {
  id: string;
  name: string;
  internalCode: string;
  unit: InventoryUnit;
  costPrice: number;
  supplier: string | null;
  currentQuantity: number;
  minimumQuantity: number;
  active: boolean;
  belowMinimum: boolean;
  outOfStock: boolean;
  notes: string | null;
  createdAt: string;
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: MovementType;
  reason: MovementReason;
  quantity: number;
  unitCost: number | null;
  totalCost: number | null;
  supplier: string | null;
  purchaseDate: string | null;
  paymentType: PurchasePaymentType | null;
  dueDate: string | null;
  financialEntryId: string | null;
  notes: string | null;
  createdAt: string;
}

export interface RegisterPurchaseResult {
  item: InventoryItem;
  movement: InventoryMovement;
  financialEntryId: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface CreateInventoryItemRequest {
  name: string;
  internalCode?: string;
  unit: InventoryUnit;
  costPrice: number;
  supplier?: string;
  currentQuantity: number;
  minimumQuantity: number;
  notes?: string;
}

export interface UpdateInventoryItemRequest {
  name: string;
  unit: InventoryUnit;
  costPrice: number;
  supplier?: string;
  minimumQuantity: number;
  notes?: string;
}

export interface RegisterPurchaseRequest {
  quantity: number;
  unitCost: number;
  supplier?: string;
  purchaseDate: string;
  paymentType: PurchasePaymentType;
  dueDate?: string;
  notes?: string;
}

export interface RegisterManualExitRequest {
  quantity: number;
  reason: MovementReason;
  notes?: string;
  exitDate: string;
}
