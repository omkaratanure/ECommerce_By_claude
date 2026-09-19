import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useSession, signOut } from "../services/authClient";

export default function Navbar() {
  const { itemCount } = useCart();
  const { data: session } = useSession();

  return (
    <header className="navbar">
      <Link to="/" className="navbar__logo">
        ShopMock
      </Link>
      <nav className="navbar__links">
        <Link to="/">Products</Link>
        <Link to="/cart" className="navbar__cart-link">
          Cart
          {itemCount > 0 && <span className="badge">{itemCount}</span>}
        </Link>
        {session ? (
          <>
            <Link to="/orders">Orders</Link>
            <span>{session.user.email}</span>
            <button type="button" onClick={() => signOut()}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log In</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
