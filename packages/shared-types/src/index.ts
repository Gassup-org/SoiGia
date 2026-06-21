export type CategorySummary = {
  id: string;
  name: string;
  slug: string;
};

export type ProductSummary = {
  id: string;
  name: string;
  categoryId: string;
};

export type HealthResponse = {
  status: "ok";
  service: string;
  timestamp: string;
};
