import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { staffQuery } from "../lib/api";

export const Route = createFileRoute("/about")({
  loader: ({ context }) => context.queryClient.ensureQueryData(staffQuery()),
  head: () => ({
    meta: [
      { title: "About — L'AURA" },
      { name: "description", content: "The philosophy, the team, and the story behind L'AURA Atelier." },
      { property: "og:title", content: "About — L'AURA" },
      { property: "og:description", content: "The philosophy, the team, and the story behind L'AURA." },
    ],
  }),
  component: About,
});

function About() {
  const { data: staff } = useSuspenseQuery(staffQuery());

  return (
    <div>
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 py-24 lg:grid-cols-2">
        <div>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            The Atelier
          </p>
          <h1 className="mb-8 font-serif text-6xl italic leading-[0.95]">
            Beauty as a considered practice.
          </h1>
          <p className="mb-6 text-muted-foreground leading-relaxed">
            L'AURA was founded on the belief that the finest care is quiet — precise formulations,
            immaculate rooms, and unhurried hands. We combine clinical expertise with the ancestral
            wisdom of botanical healing to deliver treatments that feel both restorative and rare.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Every product we stock and every service we offer has been chosen for one reason: it
            works, and it feels like a gift.
          </p>
        </div>
        <div className="aspect-[4/5] overflow-hidden bg-stone-warm">
          <img
            src="https://images.unsplash.com/photo-1470259078422-826894b933aa?auto=format&fit=crop&w=1400&q=80"
            alt="Studio"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl grid-cols-3 gap-12 px-6 py-20 md:grid">
          {[
            { label: "Mission", body: "To make luxury beauty feel personal — never performative." },
            { label: "Vision", body: "A studio where retail and ritual share one address." },
            { label: "Experience", body: "Twelve years of clinical and editorial practice." },
          ].map((b) => (
            <div key={b.label} className="border-t border-border pt-6 first:mt-0 md:border-t-0 md:pt-0">
              <p className="mb-3 text-[10px] uppercase tracking-widest text-accent">{b.label}</p>
              <p className="font-serif text-2xl italic leading-snug">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 flex items-end justify-between">
            <h2 className="font-serif text-5xl italic">Meet the team.</h2>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-5">
            {staff.map((s) => (
              <div key={s.id}>
                <div className="mb-4 aspect-[4/5] overflow-hidden bg-stone-warm">
                  <img src={s.image} alt={s.name} className="h-full w-full object-cover" />
                </div>
                <h3 className="font-serif text-xl italic">{s.name}</h3>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                  {s.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
