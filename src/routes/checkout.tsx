import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "../lib/cart";
import { formatNaira, FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING } from "../lib/currency";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — L'AURA" }, { name: "robots", content: "noindex" }] }),
  component: Checkout,
});

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState<{ orderId: string; email: string } | null>(null);

  const shipping = items.length === 0 ? 0 : subtotal > FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;

  if (items.length === 0 && !placed) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="font-serif text-4xl italic">Your bag is empty.</h1>
        <Link to="/shop" className="mt-6 inline-block border-b border-foreground/20 pb-1 text-[10px] uppercase tracking-widest">
          Back to shop
        </Link>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Order placed</p>
        <h1 className="mb-6 font-serif text-5xl italic">Thank you.</h1>
        <p className="mb-2 text-muted-foreground">
          Your order <span className="font-mono text-foreground">{placed.orderId}</span> has been received.
        </p>
        <p className="mb-10 text-muted-foreground">
          A confirmation has been sent to <span className="text-foreground">{placed.email}</span>.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-foreground px-8 py-4 text-[10px] uppercase tracking-widest text-background hover:bg-accent"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const orderId = `AUR-${Date.now().toString(36).toUpperCase()}`;
    clear();
    setPlaced({ orderId, email });
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        Checkout
      </p>
      <h1 className="mb-12 font-serif text-5xl italic">Complete your order.</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="space-y-12 lg:col-span-2">
          <Section title="Contact">
            <Field label="Full name" name="name" required />
            <div className="grid grid-cols-2 gap-6">
              <Field label="Email" name="email" type="email" required />
              <Field label="Phone" name="phone" type="tel" required />
            </div>
          </Section>

          <Section title="Shipping address">
            <Field label="Address" name="address" required />
            <div className="grid grid-cols-2 gap-6">
              <Field label="City" name="city" required />
              <Field label="Postal code" name="postal" required />
            </div>
            <Field label="Country" name="country" required />
          </Section>

          <Section title="Payment">
            <div className="space-y-3">
              {["Credit / Debit Card", "Bank Transfer", "Mobile Money"].map((p, i) => (
                <label key={p} className="flex cursor-pointer items-center gap-4 border border-border p-4 has-[:checked]:border-foreground">
                  <input type="radio" name="payment" defaultChecked={i === 0} className="accent-foreground" />
                  <span className="text-sm">{p}</span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">
              Payment processing is not live in this preview.
            </p>
          </Section>
        </div>

        <aside>
          <div className="sticky top-24 border border-border p-8">
            <p className="mb-6 text-[10px] uppercase tracking-widest text-muted-foreground">Order</p>
            <ul className="mb-6 divide-y divide-border">
              {items.map((it) => (
                <li key={it.productId} className="flex items-center gap-3 py-3">
                  <div className="h-14 w-14 flex-shrink-0 overflow-hidden bg-stone-warm">
                    <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{it.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">Qty {it.quantity}</p>
                  </div>
                  <span className="font-mono text-sm">{formatNaira(it.price * it.quantity)}</span>
                </li>
              ))}
            </ul>
            <Row label="Subtotal" value={formatNaira(subtotal)} />
            <Row label="Shipping" value={shipping === 0 ? "Free" : formatNaira(shipping)} />
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-[10px] uppercase tracking-widest">Total</span>
              <span className="font-mono text-lg">{formatNaira(total)}</span>
            </div>
            <button
              type="submit"
              className="mt-8 w-full bg-foreground px-8 py-4 text-[10px] uppercase tracking-widest text-background hover:bg-accent"
            >
              Place order
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/cart" })}
              className="mt-3 w-full text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              ← Back to bag
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-6 font-serif text-3xl italic">{title}</h2>
      <div className="space-y-6">{children}</div>
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

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full border-b border-border bg-transparent py-3 focus:border-foreground focus:outline-none"
      />
    </label>
  );
}
