import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import MenuList from "../components/MenuList";

const API = import.meta.env.VITE_API_URL;

function MenuPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const debounced = useDebounce(query, 400);

  const { data: dishes, isLoading, error } = useFetch(`${API}/api/menu`);

  if (isLoading) return <LoadingMenu />;
  if (error) return <MenuError message={error} />;

  const categories = ["All", ...new Set(dishes.map((d) => d.category))];
  const filtered = dishes.filter(
    (d) =>
      (category === "All" || d.category === category) &&
      d.name.toLowerCase().includes(debounced.toLowerCase())
  );

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Today's menu</h1>
          <p>Fresh from the campus canteen.</p>
        </div>
        <p>
          <span className="count">{filtered.length}</span> of {dishes.length} dishes
        </p>
      </div>

      <div className="toolbar">
        <input
          className="search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search dishes..."
          aria-label="Search dishes"
        />
        <div className="chips" role="group" aria-label="Filter by category">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className="chip"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <MenuList
        dishes={filtered}
        onClear={() => {
          setQuery("");
          setCategory("All");
        }}
      />
    </>
  );
}

// the free Render plan sleeps when idle, so the first request can take a while
function LoadingMenu() {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setSlow(true), 3000);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      <div className="status" role="status">
        <div className="spinner" aria-hidden="true" />
        <div>
          <h2>Loading the menu…</h2>
          <p>Getting today's dishes from the kitchen.</p>
          {slow && (
            <p className="cold-start">
              The server is waking up (free-plan cold start). The first load can take up to a minute.
            </p>
          )}
        </div>
      </div>
      <div className="menu-grid" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="skeleton" />
        ))}
      </div>
    </>
  );
}

function MenuError({ message }) {
  return (
    <div className="status error" role="alert">
      <div>
        <h2>Couldn't load the menu</h2>
        <p>Error: {message}. Check your connection and try again.</p>
        <button className="btn" type="button" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    </div>
  );
}

export default MenuPage;
