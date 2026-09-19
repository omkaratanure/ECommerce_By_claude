export async function getProducts() {
  const res = await fetch("/api/products");
  return res.json();
}

export async function getProductById(id) {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function getCategories() {
  const res = await fetch("/api/categories");
  return res.json();
}
