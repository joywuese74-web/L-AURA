import { createFileRoute } from "@tanstack/react-router";
import galleryBraids from "../assets/gallery-braids.jpg";
import galleryNails from "../assets/gallery-nails.jpg";
import heroPortrait from "../assets/hero-portrait.jpg";
import staffAdaeze from "../assets/staff-adaeze.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — L'AURA" },
      { name: "description", content: "A quiet look inside the L'AURA studio — treatments, transformations, and details." },
      { property: "og:title", content: "Gallery — L'AURA" },
      { property: "og:description", content: "Inside the L'AURA studio." },
    ],
  }),
  component: Gallery,
});

const images = [
  heroPortrait,
  galleryBraids,
  galleryNails,
  staffAdaeze,
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1591019479261-1a103585c559?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80",
];

function Gallery() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        The Studio
      </p>
      <h1 className="mb-4 font-serif text-6xl italic">Gallery.</h1>
      <p className="mb-16 max-w-lg text-muted-foreground">
        Details from the atelier — treatments, transformations, and the quiet moments in between.
      </p>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [column-fill:_balance]">
        {images.map((src, i) => (
          <div key={i} className="mb-4 break-inside-avoid overflow-hidden bg-stone-warm">
            <img src={src} alt="" loading="lazy" className="w-full transition-transform duration-700 hover:scale-105" />
          </div>
        ))}
      </div>
    </div>
  );
}
