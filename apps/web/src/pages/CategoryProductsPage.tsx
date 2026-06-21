import { Link, useParams } from "react-router-dom";

const sampleProducts = [
  { name: "Thit heo vai", slug: "thit-heo-vai", subcategory: "Thit" },
  { name: "Ca hoi fillet", slug: "ca-hoi-fillet", subcategory: "Hai san" },
  { name: "Rau cai xanh", slug: "rau-cai-xanh", subcategory: "Rau cu" }
];

export function CategoryProductsPage() {
  const { categorySlug } = useParams();

  return (
    <section>
      <h2>Danh sach san pham: {categorySlug}</h2>
      <div className="filter-bar">
        <button type="button">Thit</button>
        <button type="button">Hai san</button>
        <button type="button">Rau cu</button>
      </div>

      <div className="card-grid">
        {sampleProducts.map((product) => (
          <Link className="card" key={product.slug} to={`/products/${product.slug}`}>
            <strong>{product.name}</strong>
            <span>Loai: {product.subcategory}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
