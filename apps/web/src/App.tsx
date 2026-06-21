import { Link, Route, Routes } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { HomePage } from "./pages/HomePage";
import { CategoryProductsPage } from "./pages/CategoryProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="page-container">
        <nav className="breadcrumbs">
          <Link to="/">Trang chu</Link>
          <span>/</span>
          <Link to="/categories/thuc-pham">Danh muc</Link>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories/:categorySlug" element={<CategoryProductsPage />} />
          <Route path="/products/:productSlug" element={<ProductDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}
