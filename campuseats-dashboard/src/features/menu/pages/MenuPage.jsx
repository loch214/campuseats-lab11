import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import MenuList from "../components/MenuList";

const API = import.meta.env.VITE_API_URL;

function MenuPage() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 400);

  const { data: dishes, isLoading, error } = useFetch(`${API}/api/menu`);

  if (isLoading) return <p>Loading menu…</p>;
  if (error) return <p>Could not load menu: {error}</p>;

  const filtered = dishes.filter((d) =>
    d.name.toLowerCase().includes(debounced.toLowerCase())
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search dishes..."
      />
      <MenuList dishes={filtered} />
    </div>
  );
}

export default MenuPage;