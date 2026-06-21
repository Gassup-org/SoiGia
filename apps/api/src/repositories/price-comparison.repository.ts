const priceComparisons = {
  "prod-1": [
    { storeId: "coopmart", storeName: "Co.opmart", price: 125000, currency: "VND" },
    { storeId: "winmart", storeName: "WinMart", price: 119000, currency: "VND" }
  ],
  "prod-2": [
    { storeId: "petrolimex", storeName: "Petrolimex", price: 21980, currency: "VND" },
    { storeId: "pvoil", storeName: "PVOIL", price: 21890, currency: "VND" }
  ]
};

export const priceComparisonRepository = {
  async findByProductId(productId: string) {
    return priceComparisons[productId as keyof typeof priceComparisons] ?? [];
  }
};
