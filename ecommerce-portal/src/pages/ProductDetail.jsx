import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import QuantityStepper from "../components/QuantityStepper";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    getProductById(id).then(setProduct);
    setAdded(false);
  }, [id]);

  if (!product) {
    return (
      <div className="page">
        <p>Product not found.</p>
        <Link to="/">Back to products</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
  };

  return (
    <div className="page product-detail">
      <button className="link-back" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <div className="product-detail__content">
        <img src={product.image} alt={product.name} />
        <div>
          <h1>{product.name}</h1>
          <p className="product-card__category">{product.category}</p>
          <p className="product-detail__price">${product.price.toFixed(2)}</p>
          <p>{product.description}</p>
          <p className="stock-note">{product.stock} in stock</p>
          <QuantityStepper quantity={quantity} max={product.stock} onChange={setQuantity} />
          <button className="btn-primary" onClick={handleAddToCart}>
            Add to Cart
          </button>
          {added && (
            <p className="confirm-note">
              Added to cart. <Link to="/cart">View cart</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
