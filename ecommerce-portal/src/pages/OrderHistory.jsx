import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../services/orderService";

export default function OrderHistory() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(() => setError("Failed to load your orders."));
  }, []);

  if (error) {
    return (
      <div className="page">
        <h1>Your Orders</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!orders) {
    return (
      <div className="page">
        <h1>Your Orders</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="page">
        <h1>Your Orders</h1>
        <p>You haven&apos;t placed any orders yet.</p>
        <Link to="/">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Your Orders</h1>
      {orders.map((order) => (
        <div key={order.id} className="checkout-summary">
          <h2>{order.id}</h2>
          <p>{new Date(order.placedAt).toLocaleString()}</p>
          {order.items.map((item) => (
            <div className="summary-line" key={item.productId}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-line summary-total">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
