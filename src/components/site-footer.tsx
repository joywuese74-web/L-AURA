import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <h2 className="mb-8 font-serif text-4xl italic">L'AURA</h2>
          <div className="max-w-sm">
            <p className="mb-6 text-[10px] uppercase tracking-widest text-muted-foreground">Newsletter</p>
            <form
              className="flex border-b border-foreground/20"
              onSubmit={(e) => {
                e.preventDefault();
                (e.currentTarget as HTMLFormElement).reset();
              }}
            >
              <input
                type="email"
                required
                placeholder="Your email address"
                className="flex-1 bg-transparent py-3 text-sm focus:outline-none"
              />
              <button className="px-4 py-3 text-[10px] uppercase tracking-widest hover:text-accent">Join</button>
            </form>
          </div>
        </div>
        <div>
          <p className="mb-6 text-[10px] font-semibold uppercase tracking-widest">Studio</p>
          <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
            <li><Link to="/services" className="hover:text-foreground">Treatments</Link></li>
            <li><Link to="/shop" className="hover:text-foreground">Boutique</Link></li>
            <li><Link to="/about" className="hover:text-foreground">Our Process</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-6 text-[10px] font-semibold uppercase tracking-widest">Follow</p>
          <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">Instagram</a></li>
            <li><a href="#" className="hover:text-foreground">Pinterest</a></li>
            <li><a href="#" className="hover:text-foreground">TikTok</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-24 flex max-w-7xl items-center justify-between border-t border-border pt-8 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} L'AURA Atelier</p>
        <p>Privacy / Terms</p>
      </div>
    </footer>
  );
}
