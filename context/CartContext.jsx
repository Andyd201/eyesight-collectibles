"use client";

import { createContext, useContext, useReducer, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
// cartItem: { id, type: 'product'|'single', name, price, image, set, language, stock, quantity }

const CartContext = createContext(null);

// ─── Reducer ─────────────────────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {
    case "LOAD":
      return { ...state, items: action.items, loaded: true };

    case "ADD": {
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        // Respect stock limit
        const newQty = Math.min(existing.quantity + (action.qty ?? 1), action.item.stock ?? 99);
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, quantity: newQty } : i
          ),
          open: true,
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.item, quantity: action.qty ?? 1 }],
        open: true,
      };
    }

    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };

    case "SET_QTY": {
      if (action.qty < 1) {
        return { ...state, items: state.items.filter((i) => i.id !== action.id) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id
            ? { ...i, quantity: Math.min(action.qty, i.stock ?? 99) }
            : i
        ),
      };
    }

    case "CLEAR":
      return { ...state, items: [] };

    case "OPEN":
      return { ...state, open: true };

    case "CLOSE":
      return { ...state, open: false };

    default:
      return state;
  }
}

const INITIAL = { items: [], open: false, loaded: false };
const STORAGE_KEY = "eyesight_cart";

// ─── Provider ─────────────────────────────────────────────────────────────────
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, INITIAL);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: "LOAD", items: JSON.parse(saved) });
      else dispatch({ type: "LOAD", items: [] });
    } catch {
      dispatch({ type: "LOAD", items: [] });
    }
  }, []);

  // Persist to localStorage whenever items change
  useEffect(() => {
    if (state.loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    }
  }, [state.items, state.loaded]);

  // ─── Actions ───────────────────────────────────────────────────────────────
  const addItem = useCallback((item, qty = 1) => {
    dispatch({ type: "ADD", item, qty });
  }, []);

  const removeItem = useCallback((id) => {
    dispatch({ type: "REMOVE", id });
  }, []);

  const setQty = useCallback((id, qty) => {
    dispatch({ type: "SET_QTY", id, qty });
  }, []);

  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const openCart  = useCallback(() => dispatch({ type: "OPEN" }),  []);
  const closeCart = useCallback(() => dispatch({ type: "CLOSE" }), []);

  // ─── Derived values ────────────────────────────────────────────────────────
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal  = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items:    state.items,
        open:     state.open,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        setQty,
        clearCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
