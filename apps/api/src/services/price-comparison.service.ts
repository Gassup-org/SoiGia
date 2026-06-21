import { priceComparisonRepository } from "../repositories/price-comparison.repository";

export const priceComparisonService = {
  async getByProductId(productId: string) {
    return priceComparisonRepository.findByProductId(productId);
  }
};
