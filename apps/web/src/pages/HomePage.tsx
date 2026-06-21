import { Link } from "react-router-dom";

const topCategories = [
  { name: "Thuc pham", slug: "thuc-pham" },
  { name: "Xang dau", slug: "xang-dau" },
  { name: "Thoi trang", slug: "thoi-trang" }
];

export function HomePage() {
  return (
    <section>
      <h2>Danh muc noi bat</h2>
      <div className="card-grid">
        {topCategories.map((category) => (
          <Link className="card" key={category.slug} to={`/categories/${category.slug}`}>
            <strong>{category.name}</strong>
            <span>Xem san pham va gia theo cua hang</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
