import { productsRepository } from "../repositories/products.repository";

export const productsService = {
  async listProductsByCategory(categorySlug: string) {
    return productsRepository.findByCategorySlug(categorySlug);
  },

  async getProductBySlug(slug: string) {
    return productsRepository.findBySlug(slug);
  }
};
