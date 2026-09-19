import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../services/orderService";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="page">
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
        <Link to="/">Continue shopping</Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    if (!form.address.trim()) next.address = "Address is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitError("");
    setSubmitting(true);
    try {
      const order = await placeOrder({ items, total, shipping: form });
      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch {
      setSubmitError("Something went wrong placing your order. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <label>
            Full Name
            <input name="name" value={form.name} onChange={handleChange} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>
          <label>
            Shipping Address
            <textarea name="address" value={form.address} onChange={handleChange} />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </label>
          {submitError && <span className="field-error">{submitError}</span>}
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Placing Order..." : `Place Order ($${total.toFixed(2)})`}
          </button>
        </form>
        <div className="checkout-summary">
          <h2>Order Summary</h2>
          {items.map((item) => (
            <div className="summary-line" key={item.productId}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-line summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
