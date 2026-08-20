import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "../lib/cart";
import { formatNaira, FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING } from "../lib/currency";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — L'AURA" }, { name: "robots", content: "noindex" }] }),
  component: Cart,
});

function Cart() {
  const { items, setQty, remove, subtotal, clear } = useCart();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(0);

  const shipping = items.length === 0 ? 0 : subtotal > FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = Math.max(0, subtotal - applied) + shipping;

  const apply = () => {
    if (coupon.trim().toUpperCase() === "AURA10") setApplied(subtotal * 0.1);
    else setApplied(0);
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Your bag
        </p>
        <h1 className="mb-6 font-serif text-5xl italic">Your bag is empty.</h1>
        <Link
          to="/shop"
          className="inline-block bg-foreground px-8 py-4 text-[10px] uppercase tracking-widest text-background hover:bg-accent"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h1 className="mb-10 font-serif text-5xl italic">Your bag.</h1>
        <ul className="divide-y divide-border border-y border-border">
          {items.map((it) => (
            <li key={it.productId} className="grid grid-cols-12 gap-4 py-6">
              <div className="col-span-3 md:col-span-2 aspect-square overflow-hidden bg-stone-warm">
                <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
              </div>
              <div className="col-span-9 md:col-span-6">
                <Link to="/shop/$productId" params={{ productId: it.productId }} className="font-serif text-xl italic hover:text-accent">
                  {it.name}
                </Link>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{formatNaira(it.price)}</p>
                <button
                  onClick={() => remove(it.productId)}
                  className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive"
                >
                  Remove
                </button>
              </div>
              <div className="col-span-6 md:col-span-2 flex items-center">
                <div className="flex items-center border border-border">
                  <button onClick={() => setQty(it.productId, it.quantity - 1)} className="px-3 py-2 text-sm">−</button>
                  <span className="min-w-[3ch] px-2 text-center font-mono text-sm">{it.quantity}</span>
                  <button onClick={() => setQty(it.productId, it.quantity + 1)} className="px-3 py-2 text-sm">+</button>
                </div>
              </div>
              <div className="col-span-6 md:col-span-2 flex items-center justify-end font-mono text-sm">
                {formatNaira(it.price * it.quantity)}
              </div>
            </li>
          ))}
        </ul>
        <button onClick={clear} className="mt-6 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive">
          Clear bag
        </button>
      </div>

      <aside className="lg:col-span-1">
        <div className="border border-border p-8">
          <p className="mb-6 text-[10px] uppercase tracking-widest text-muted-foreground">Summary</p>
          <Row label="Subtotal" value={formatNaira(subtotal)} />
          {applied > 0 && <Row label="Discount" value={`− ${formatNaira(applied)}`} />}
          <Row label="Shipping" value={shipping === 0 ? "Free" : formatNaira(shipping)} />
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-[10px] uppercase tracking-widest">Total</span>
            <span className="font-mono text-lg">{formatNaira(total)}</span>
          </div>

          <div className="mt-8">
            <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Promo code</p>
            <div className="flex border-b border-border">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter code"
                className="flex-1 bg-transparent py-2 text-sm focus:outline-none"
              />
              <button onClick={apply} className="px-3 text-[10px] uppercase tracking-widest hover:text-accent">
                Apply
              </button>
            </div>
            <p className="mt-2 font-mono text-[10px] text-muted-foreground">Try AURA10</p>
          </div>

          <Link
            to="/checkout"
            className="mt-8 block w-full bg-foreground px-8 py-4 text-center text-[10px] uppercase tracking-widest text-background hover:bg-accent"
          >
            Proceed to checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-mono text-sm">{value}</span>
    </div>
  );
}
