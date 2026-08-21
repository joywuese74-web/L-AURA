import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  /** Promo code held across cart -> checkout; validated by the pricing rules. */
  coupon: string;
  setCoupon: (code: string) => void;
  /** Backend-ready payload: only ids and quantities. */
  lines: { productId: string; quantity: number }[];
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "laura_cart_v1";
const COUPON_KEY = "laura_coupon_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
      setCoupon(localStorage.getItem(COUPON_KEY) ?? "");
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    localStorage.setItem(COUPON_KEY, coupon);
  }, [items, coupon, hydrated]);

  const add: CartContextValue["add"] = (item, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((p) => p.productId === item.productId);
      if (found) {
        return prev.map((p) =>
          p.productId === item.productId ? { ...p, quantity: p.quantity + qty } : p,
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const remove: CartContextValue["remove"] = (productId) =>
    setItems((prev) => prev.filter((p) => p.productId !== productId));

  const setQty: CartContextValue["setQty"] = (productId, qty) => {
    if (qty <= 0) return remove(productId);
    setItems((prev) => prev.map((p) => (p.productId === productId ? { ...p, quantity: qty } : p)));
  };

  const clear = () => {
    setItems([]);
    setCoupon("");
  };

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const lines = items.map((i) => ({ productId: i.productId, quantity: i.quantity }));

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, clear, count, subtotal, coupon, setCoupon, lines }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
