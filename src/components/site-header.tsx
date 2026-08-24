import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "../lib/cart";

const links = [
  { to: "/shop", label: "Shop" },
  { to: "/services", label: "Services" },
  { to: "/book", label: "Book" },
] as const;

const rightLinks = [
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="hidden gap-8 text-[10px] font-medium uppercase tracking-[0.2em] md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="transition-colors hover:text-accent"
              activeProps={{ className: "text-accent" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <Link to="/" className="font-serif text-2xl font-semibold italic tracking-tighter">
          L'AURA
        </Link>

        <div className="hidden items-center gap-8 text-[10px] font-medium uppercase tracking-[0.2em] md:flex">
          {rightLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="transition-colors hover:text-accent"
              activeProps={{ className: "text-accent" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/cart"
            className="transition-colors hover:text-accent"
            activeProps={{ className: "text-accent" }}
          >
            Cart ({count})
          </Link>
        </div>

        {/* Mobile trigger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-[10px] uppercase tracking-[0.2em]"
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-[11px] uppercase tracking-[0.2em]">
            {[...links, ...rightLinks, { to: "/cart", label: `Cart (${count})` }].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={pathname === l.to ? "text-accent" : ""}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
