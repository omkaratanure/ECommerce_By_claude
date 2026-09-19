export async function getOrderById(id) {
  const res = await fetch(`/api/orders/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function getMyOrders() {
  const res = await fetch("/api/orders/mine");
  if (!res.ok) throw new Error("Failed to load orders");
  return res.json();
}

export async function placeOrder({ items, total, shipping }) {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, total, shipping }),
  });
  if (!res.ok) throw new Error("Failed to place order");
  return res.json();
}
