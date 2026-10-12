import { Routes, Route, NavLink, Link } from "react-router-dom";
import MenuPage from "./features/menu/pages/MenuPage";
import DishDetailPage from "./features/menu/pages/DishDetailPage";
import OrderPage from "./features/menu/pages/OrderPage";

export default function App() {
  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand">
            Campus<span>Eats</span>
          </Link>
          <nav className="nav">
            <NavLink to="/" end>Menu</NavLink>
            <NavLink to="/order">Place order</NavLink>
          </nav>
        </div>
      </header>
      <main className="page">
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/dish/:id" element={<DishDetailPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="*" element={<p className="empty">404 — Page not found</p>} />
        </Routes>
      </main>
    </>
  );
}
