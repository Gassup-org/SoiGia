import { useParams } from "react-router-dom";

const samplePrices = [
  { store: "Co.opmart", price: "125.000 VND" },
  { store: "WinMart", price: "119.000 VND" },
  { store: "Bach Hoa Xanh", price: "122.000 VND" }
];

export function ProductDetailPage() {
  const { productSlug } = useParams();

  return (
    <section>
      <h2>So sanh gia cho: {productSlug}</h2>
      <div className="price-list">
        {samplePrices.map((item) => (
          <article className="price-row" key={item.store}>
            <strong>{item.store}</strong>
            <span>{item.price}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
