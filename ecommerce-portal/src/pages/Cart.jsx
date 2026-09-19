import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import QuantityStepper from "../components/QuantityStepper";

export default function Cart() {
  const { items, total, updateQty, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="page">
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Your Cart</h1>
      <div className="cart-list">
        {items.map((item) => (
          <div className="cart-item" key={item.productId}>
            <img src={item.image} alt={item.name} />
            <div className="cart-item__info">
              <h3>{item.name}</h3>
              <p>${item.price.toFixed(2)}</p>
            </div>
            <QuantityStepper
              quantity={item.quantity}
              onChange={(q) => updateQty(item.productId, q)}
            />
            <p className="cart-item__subtotal">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
            <button
              className="btn-remove"
              onClick={() => removeItem(item.productId)}
              aria-label={`Remove ${item.name}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <p>Total: ${total.toFixed(2)}</p>
        <Link to="/checkout" className="btn-primary">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
