import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — L'AURA" },
      { name: "description", content: "Visit L'AURA Atelier or get in touch to book a private consultation." },
      { property: "og:title", content: "Contact — L'AURA" },
      { property: "og:description", content: "Visit L'AURA or get in touch." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 py-16 lg:grid-cols-2">
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Say hello
        </p>
        <h1 className="mb-8 font-serif text-6xl italic">Contact.</h1>

        <div className="space-y-8 text-sm">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Studio</p>
            <p>1280 Boutique Way</p>
            <p>Lekki, Lagos 106104</p>
          </div>
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Hours</p>
            <p>Monday – Saturday · 10:00 – 20:00</p>
            <p>Sunday · By appointment</p>
          </div>
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Contact</p>
            <p>hello@laura.studio</p>
            <p>+234 (0) 800 000 0000</p>
          </div>
          <div className="flex gap-4">
            <a
              href="https://wa.me/2348000000000"
              className="border border-foreground/20 px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-foreground hover:text-background"
            >
              WhatsApp
            </a>
            <a
              href="mailto:hello@laura.studio"
              className="border border-foreground/20 px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-foreground hover:text-background"
            >
              Email us
            </a>
          </div>
        </div>

        <div className="mt-12 aspect-[4/3] overflow-hidden border border-border">
          <iframe
            title="Map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=3.44%2C6.42%2C3.50%2C6.46&layer=mapnik"
            className="h-full w-full grayscale"
            loading="lazy"
          />
        </div>
      </div>

      <div>
        <div className="border border-border p-8">
          <h2 className="mb-8 font-serif text-3xl italic">Send us a note.</h2>
          {sent ? (
            <p className="text-sm text-muted-foreground">
              Thank you. We'll be in touch within one business day.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-6"
            >
              <Field label="Name" name="name" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Phone" name="phone" type="tel" />
              <label className="block">
                <span className="mb-2 block text-[10px] uppercase tracking-widest text-muted-foreground">
                  Message
                </span>
                <textarea
                  required
                  rows={5}
                  className="w-full border-b border-border bg-transparent py-3 focus:border-foreground focus:outline-none"
                />
              </label>
              <button className="w-full bg-foreground px-8 py-4 text-[10px] uppercase tracking-widest text-background hover:bg-accent">
                Send
              </button>
            </form>
          )}
        </div>
      </div>
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
