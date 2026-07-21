import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { productById, products } from "../lib/products";
import { ProductCard } from "../components/product-card";
import { useCart } from "../lib/cart";

export const Route = createFileRoute("/shop/$productId")({
  loader: ({ params }) => {
    const product = productById(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — L'AURA` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — L'AURA` },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [{ title: "Product — L'AURA" }, { name: "robots", content: "noindex" }],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="font-serif text-4xl italic">Product not found.</h1>
      <Link to="/shop" className="mt-6 inline-block border-b border-foreground/20 pb-1 text-[10px] uppercase tracking-widest">
        Back to shop
      </Link>
    </div>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"description" | "ingredients" | "directions">("description");
  const { add } = useCart();
  const navigate = useNavigate();

  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  const handleAdd = () => {
    add({ productId: product.id, name: product.name, price: product.price, image: product.image }, qty);
  };
  const handleBuy = () => {
    handleAdd();
    navigate({ to: "/cart" });
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="aspect-[4/5] overflow-hidden bg-stone-warm">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="lg:pt-8">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {product.category}
          </p>
          <h1 className="mb-2 font-serif text-5xl italic">{product.name}</h1>
          <p className="mb-6 text-muted-foreground italic">{product.tagline}</p>

          <div className="mb-8 flex items-center gap-4">
            <span className="font-mono text-xl">${product.price}</span>
            <span className="text-accent">★★★★★</span>
            <span className="text-[11px] text-muted-foreground">({product.reviews} reviews)</span>
          </div>

          <p className="mb-10 max-w-md leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mb-8 flex items-center gap-4">
            <div className="flex items-center border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-3 text-sm">−</button>
              <span className="min-w-[3ch] px-2 text-center font-mono text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-4 py-3 text-sm">+</button>
            </div>
            <button
              onClick={handleAdd}
              className="flex-1 bg-foreground px-8 py-4 text-[11px] uppercase tracking-widest text-background hover:bg-accent"
            >
              Add to Cart
            </button>
          </div>
          <button
            onClick={handleBuy}
            className="mb-12 w-full border border-foreground/20 px-8 py-4 text-[11px] uppercase tracking-widest hover:bg-foreground hover:text-background"
          >
            Buy Now
          </button>

          <div className="border-t border-border">
            <div className="flex gap-8 border-b border-border text-[10px] uppercase tracking-[0.2em]">
              {(["description", "ingredients", "directions"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`py-4 transition-colors ${tab === t ? "border-b border-foreground text-foreground" : "text-muted-foreground"}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="py-6 text-sm leading-relaxed text-muted-foreground">
              {tab === "description" && <p>{product.description}</p>}
              {tab === "ingredients" && (
                <ul className="grid grid-cols-2 gap-2">
                  {product.ingredients.map((i: string) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-2 h-px w-3 bg-accent" />
                      {i}
                    </li>
                  ))}
                </ul>
              )}
              {tab === "directions" && <p>{product.directions}</p>}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-10 font-serif text-3xl italic">You may also like</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
