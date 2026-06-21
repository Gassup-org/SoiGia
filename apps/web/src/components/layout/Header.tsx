import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="site-header">
      <div>
        <p className="eyebrow">SoiGia</p>
        <h1>San giao dien theo doi va so sanh gia</h1>
      </div>

      <nav className="header-nav">
        <Link to="/">Trang chu</Link>
        <Link to="/categories/thuc-pham">Danh muc</Link>
      </nav>
    </header>
  );
}
