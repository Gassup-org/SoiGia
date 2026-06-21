import { categoriesRepository } from "../repositories/categories.repository";

export const categoriesService = {
  async listCategories() {
    return categoriesRepository.findAll();
  }
};
