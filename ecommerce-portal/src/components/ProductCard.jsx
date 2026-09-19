import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <img src={product.image} alt={product.name} loading="lazy" />
      <div className="product-card__body">
        <h3>{product.name}</h3>
        <p className="product-card__category">{product.category}</p>
        <p className="product-card__price">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
