import { createContext, useContext, useEffect, useReducer } from "react";
import { getItem, setItem } from "../services/storageService";

const CART_KEY = "ecommerce_cart";
const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity } = action.payload;
      const existing = state.items.find((i) => i.productId === product.id);
      let items;
      if (existing) {
        items = state.items.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        items = [
          ...state.items,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity,
          },
        ];
      }
      return { ...state, items };
    }
    case "UPDATE_QTY": {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.productId !== productId),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === productId ? { ...i, quantity } : i
        ),
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.productId !== action.payload.productId),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(
    cartReducer,
    undefined,
    () => getItem(CART_KEY, { items: [] })
  );

  useEffect(() => {
    setItem(CART_KEY, state);
  }, [state]);

  const addItem = (product, quantity = 1) =>
    dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
  const updateQty = (productId, quantity) =>
    dispatch({ type: "UPDATE_QTY", payload: { productId, quantity } });
  const removeItem = (productId) =>
    dispatch({ type: "REMOVE_ITEM", payload: { productId } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        itemCount,
        total,
        addItem,
        updateQty,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
