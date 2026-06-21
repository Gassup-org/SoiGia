export type CategoryLevel = 1 | 2;

export interface Category {
  id: string;
  name: string;
  slug: string;
  level: CategoryLevel;
  parentId?: string;
}

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  unit?: string;
}

export interface PriceEntry {
  storeId: string;
  storeName: string;
  price: number;
  currency: "VND";
  updatedAt: string;
}

export interface PriceUpdateEvent {
  source: string;
  productId: string;
  entries: PriceEntry[];
  collectedAt: string;
}
