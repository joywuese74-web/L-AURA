import { createFileRoute, Link } from "@tanstack/react-router";
import { services, categoryMeta, type Service } from "../lib/services";
import { formatNaira } from "../lib/currency";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — L'AURA" },
      { name: "description", content: "Skincare, treatments, massage, nails, and hair services at L'AURA Atelier." },
      { property: "og:title", content: "Services — L'AURA" },
      { property: "og:description", content: "Skincare, treatments, massage, nails, and hair services." },
    ],
  }),
  component: Services,
});

const categoryOrder: Service["category"][] = ["Skincare", "Treatments", "Massage", "Nails", "Hair"];

function Services() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          The Menu
        </p>
        <h1 className="mb-4 font-serif text-6xl italic">Services.</h1>
        <p className="max-w-xl text-muted-foreground">
          Every treatment begins with a consultation and ends with a considered ritual. Choose a
          category to explore the menu.
        </p>
      </section>

      {categoryOrder.map((cat) => {
        const list = services.filter((s) => s.category === cat);
        const meta = categoryMeta[cat];
        return (
          <section key={cat} id={cat} className="border-t border-border">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <div className="aspect-[4/5] overflow-hidden bg-stone-warm">
                  <img src={meta.image} alt={cat} className="h-full w-full object-cover" />
                </div>
                <h2 className="mt-8 font-serif text-4xl italic">{cat}</h2>
                <p className="mt-3 text-muted-foreground">{meta.blurb}</p>
                <Link
                  to="/book"
                  search={{ service: list[0]?.id }}
                  className="mt-6 inline-block bg-foreground px-6 py-3 text-[10px] uppercase tracking-widest text-background hover:bg-accent"
                >
                  Book {cat}
                </Link>
              </div>
              <div className="lg:col-span-8">
                <ul className="divide-y divide-border">
                  {list.map((s) => (
                    <li key={s.id} className="grid grid-cols-12 gap-4 py-6">
                      <div className="col-span-12 md:col-span-6">
                        <h3 className="font-serif text-2xl italic">{s.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                      </div>
                      <div className="col-span-6 md:col-span-3 flex items-center font-mono text-xs text-muted-foreground">
                        {s.duration} min
                      </div>
                      <div className="col-span-6 md:col-span-2 flex items-center font-mono text-sm">
                        {formatNaira(s.price)}
                      </div>
                      <div className="col-span-12 md:col-span-1 flex items-center justify-end">
                        <Link
                          to="/book"
                          search={{ service: s.id }}
                          className="text-[10px] uppercase tracking-widest text-accent hover:text-foreground"
                        >
                          Book
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
