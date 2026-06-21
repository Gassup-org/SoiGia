const categories = [
  { id: "cat-food", name: "Thuc pham", slug: "thuc-pham", level: 1 },
  { id: "cat-fuel", name: "Xang dau", slug: "xang-dau", level: 1 },
  { id: "cat-fashion", name: "Thoi trang", slug: "thoi-trang", level: 1 }
];

export const categoriesRepository = {
  async findAll() {
    return categories;
  }
};
