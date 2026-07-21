import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { products, type Product } from "../lib/products";
import { ProductCard } from "../components/product-card";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — L'AURA" },
      { name: "description", content: "Shop premium skincare essentials from L'AURA Atelier." },
      { property: "og:title", content: "Shop — L'AURA" },
      { property: "og:description", content: "Premium skincare essentials, curated by L'AURA." },
    ],
  }),
  component: Shop,
});

const categories: (Product["category"] | "All")[] = [
  "All",
  "Serums",
  "Cleansers",
  "Moisturizers",
  "Sunscreen",
  "Body",
];

function Shop() {
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const filtered = useMemo(
    () => (cat === "All" ? products : products.filter((p) => p.category === cat)),
    [cat],
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="border-b border-border pb-10">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          The Boutique
        </p>
        <h1 className="font-serif text-6xl italic">Shop the collection.</h1>
        <p className="mt-4 max-w-lg text-muted-foreground">
          Professional-grade formulas, bottled for your home sanctuary.
        </p>
      </div>

      <div className="my-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.2em]">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`border-b pb-1 transition-colors ${
              cat === c ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
