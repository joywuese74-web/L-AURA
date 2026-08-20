import { Link } from "@tanstack/react-router";
import type { Product } from "../lib/products";
import { formatNaira } from "../lib/currency";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/shop/$productId"
      params={{ productId: product.id }}
      className="group block"
    >
      <div className="mb-4 aspect-[3/4] overflow-hidden bg-stone-warm">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-medium">{product.name}</h4>
          <p className="text-[11px] italic text-muted-foreground">{product.tagline}</p>
        </div>
        <span className="font-mono text-xs">{formatNaira(product.price)}</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[9px] text-accent">★★★★★</span>
        <span className="text-[9px] text-muted-foreground">({product.reviews})</span>
      </div>
    </Link>
  );
}
