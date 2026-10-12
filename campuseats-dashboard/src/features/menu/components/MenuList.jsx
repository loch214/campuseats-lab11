import DishCard from "./DishCard";

function MenuList({ dishes, onClear }) {
  if (!dishes.length)
    return (
      <div className="empty">
        <p>No dishes match your search.</p>
        <button className="btn ghost" type="button" onClick={onClear}>
          Show all dishes
        </button>
      </div>
    );
  return (
    <div className="menu-grid">
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} />
      ))}
    </div>
  );
}
export default MenuList;
