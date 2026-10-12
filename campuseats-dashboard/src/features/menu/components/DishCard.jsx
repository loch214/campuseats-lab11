const ICONS = { Mains: "🍛", Snacks: "🥪", Dessert: "🍮", Drinks: "🥤" };

function DishCard({ dish }) {
  return (
    <div className={dish.available ? "dish-card" : "dish-card sold-out"}>
      <div className="dish-main">
        <span className="dish-icon" aria-hidden="true">
          {ICONS[dish.category] ?? "🍽️"}
        </span>
        <div>
          <h3>{dish.name}</h3>
          <span className="dish-cat">{dish.category}</span>
        </div>
      </div>
      <div className="ticket">
        {dish.available ? (
          <>
            <small>Rs.</small>
            <strong>{dish.price.toFixed(0)}</strong>
          </>
        ) : (
          <strong>Sold out</strong>
        )}
      </div>
    </div>
  );
}
export default DishCard;
