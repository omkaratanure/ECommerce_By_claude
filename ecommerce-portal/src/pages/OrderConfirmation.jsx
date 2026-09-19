import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../services/orderService";

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(undefined);

  useEffect(() => {
    setOrder(undefined);
    getOrderById(id).then(setOrder);
  }, [id]);

  if (order === undefined) {
    return (
      <div className="page">
        <p>Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page">
        <p>Order not found.</p>
        <Link to="/">Back to products</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Thank you, {order.shipping.name}!</h1>
      <p>Your order has been placed.</p>
      <p className="order-id">Order ID: {order.id}</p>
      <div className="checkout-summary">
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
      <p>Shipping to: {order.shipping.address}</p>
      <Link to="/" className="btn-primary">
        Continue Shopping
      </Link>
    </div>
  );
}
