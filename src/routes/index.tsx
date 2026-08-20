import { createFileRoute, Link } from "@tanstack/react-router";
import { products } from "../lib/products";
import { services, categoryMeta } from "../lib/services";
import { ProductCard } from "../components/product-card";
import galleryBraids from "../assets/gallery-braids.jpg";
import galleryNails from "../assets/gallery-nails.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

import heroImage from "../assets/hero-portrait.jpg";

const bookingImage =
  "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1400&q=80";

const galleryPreviews = [
  galleryBraids,
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
  galleryNails,
  "https://images.unsplash.com/photo-1591019479261-1a103585c559?auto=format&fit=crop&w=800&q=80",
];

const featured = products.slice(0, 4);
const categoryOrder = ["Skincare", "Treatments", "Massage", "Nails", "Hair"] as const;

function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative flex h-[90vh] items-center overflow-hidden px-6">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/40 to-transparent" />
        </div>
        <div className="animate-reveal relative z-10 mx-auto w-full max-w-7xl">
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Skincare — Aesthetics — Atelier
          </p>
          <h1 className="mb-8 max-w-2xl text-balance font-serif text-6xl italic leading-[0.95] lg:text-8xl">
            Reveal your <br />
            natural radiance.
          </h1>
          <p className="mb-10 max-w-lg text-pretty text-muted-foreground">
            Premium skincare, luxury beauty treatments, and professional salon services — designed to
            make you look and feel your best.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/shop"
              className="bg-foreground px-8 py-4 text-[11px] uppercase tracking-widest text-background transition-colors hover:bg-accent"
            >
              Shop Products
            </Link>
            <Link
              to="/book"
              className="border border-foreground/20 px-8 py-4 text-[11px] uppercase tracking-widest transition-all hover:bg-foreground hover:text-background"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES — asymmetric editorial */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              The Boutique
            </p>
            <h2 className="font-serif text-5xl italic">A curated house of care.</h2>
          </div>
          <Link to="/services" className="border-b border-foreground/20 pb-1 text-[10px] uppercase tracking-widest">
            All services
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Skincare — large */}
          <Link
            to="/services"
            hash="Skincare"
            className="group relative col-span-12 aspect-[4/5] overflow-hidden lg:col-span-7"
          >
            <img
              src={categoryMeta.Skincare.image}
              alt="Skincare"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
            <div className="absolute bottom-8 left-8 text-background">
              <p className="mb-2 font-mono text-[10px]">01/</p>
              <h3 className="font-serif text-4xl italic">Skincare Products</h3>
              <p className="mt-2 max-w-xs text-sm text-background/80">
                Moisturizers, cleansers, serums, and daily protection.
              </p>
              <span className="mt-4 inline-block border-b border-background/50 pb-1 text-[10px] uppercase tracking-widest">
                Shop now
              </span>
            </div>
          </Link>

          {/* Right column stack */}
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-5">
            <Link
              to="/services"
              hash="Hair"
              className="group relative aspect-square overflow-hidden"
            >
              <img
                src={categoryMeta.Hair.image}
                alt="Hair Studio"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute bottom-6 left-6 text-background">
                <p className="mb-2 font-mono text-[10px]">02/</p>
                <h3 className="font-serif text-3xl italic">Hair Studio</h3>
              </div>
            </Link>

            <Link
              to="/services"
              hash="Nails"
              className="flex aspect-video flex-col justify-between border border-border p-8"
            >
              <div>
                <p className="mb-2 font-mono text-[10px] text-muted-foreground">03/</p>
                <h3 className="font-serif text-3xl italic">Nail Atelier</h3>
              </div>
              <p className="max-w-xs text-sm text-muted-foreground">
                Precision techniques meet high-fashion aesthetics in our sanctuary of detail.
              </p>
            </Link>
          </div>

          {/* Bottom row */}
          {(["Massage", "Treatments"] as const).map((cat, i) => (
            <Link
              key={cat}
              to="/services"
              hash={cat}
              className="group relative col-span-12 aspect-[4/3] overflow-hidden lg:col-span-6"
            >
              <img
                src={categoryMeta[cat].image}
                alt={cat}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
              <div className="absolute bottom-6 left-6 text-background">
                <p className="mb-2 font-mono text-[10px]">{`0${i + 4}/`}</p>
                <h3 className="font-serif text-3xl italic">{cat === "Treatments" ? "Skin Treatments" : cat}</h3>
                <p className="mt-1 max-w-xs text-sm text-background/80">{categoryMeta[cat].blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BOOKING STRIP */}
      <section className="bg-foreground px-6 py-20 text-background">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="mb-4 block font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              Concierge
            </span>
            <h2 className="mb-6 font-serif text-5xl italic leading-tight">
              Direct booking, <br /> immaculate service.
            </h2>
            <p className="mb-8 max-w-md text-background/70">
              Choose a service, pick a date and time, and select your preferred specialist. Your seat is
              held instantly.
            </p>
            <Link
              to="/book"
              className="inline-block bg-accent px-8 py-4 text-[11px] font-semibold uppercase tracking-widest text-foreground hover:bg-background hover:text-foreground"
            >
              Reserve your session
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden">
            <img src={bookingImage} alt="Booking" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              The Shop
            </p>
            <h2 className="font-serif text-5xl italic">Essential edits.</h2>
          </div>
          <Link to="/shop" className="border-b border-foreground/20 pb-1 text-[10px] uppercase tracking-widest">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* SERVICES QUICK LINKS */}
      <section className="border-t border-border bg-secondary/30 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            The Menu
          </p>
          <h2 className="mb-12 font-serif text-4xl italic">Five houses under one roof.</h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
            {categoryOrder.map((cat) => {
              const count = services.filter((s) => s.category === cat).length;
              return (
                <Link
                  key={cat}
                  to="/services"
                  hash={cat}
                  className="group border border-border bg-background p-6 transition-colors hover:border-foreground/40"
                >
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {count} services
                  </p>
                  <h3 className="mt-4 font-serif text-2xl italic">{cat}</h3>
                  <span className="mt-6 block text-[10px] uppercase tracking-widest text-accent">
                    Explore →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex items-end justify-between">
          <h2 className="font-serif text-5xl italic">In the studio.</h2>
          <Link to="/gallery" className="border-b border-foreground/20 pb-1 text-[10px] uppercase tracking-widest">
            Full gallery
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {galleryPreviews.map((src, i) => (
            <div key={i} className="aspect-[3/4] overflow-hidden bg-stone-warm">
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="border-y border-border bg-secondary/40 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="font-serif text-[64px] italic leading-none text-accent">"</span>
          <p className="mb-6 font-serif text-2xl italic leading-relaxed">
            The Sculpting Facial at L'AURA is less a treatment and more a transformative experience. My
            skin has never looked more architectural.
          </p>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest">Julianne Grey</span>
            <span className="text-[10px] uppercase text-muted-foreground">Vogue Editorialist</span>
          </div>
        </div>
      </section>
    </div>
  );
}
