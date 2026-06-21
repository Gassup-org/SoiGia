const products = [
  {
    id: "prod-1",
    name: "Thit heo vai",
    slug: "thit-heo-vai",
    categorySlug: "thuc-pham",
    unit: "kg"
  },
  {
    id: "prod-2",
    name: "Xang RON95",
    slug: "xang-ron95",
    categorySlug: "xang-dau",
    unit: "lit"
  }
];

export const productsRepository = {
  async findByCategorySlug(categorySlug: string) {
    return categorySlug ? products.filter((product) => product.categorySlug === categorySlug) : products;
  },

  async findBySlug(slug: string) {
    return products.find((product) => product.slug === slug) ?? null;
  }
};
