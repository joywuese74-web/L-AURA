import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { z } from "zod";
import {
  api,
  ApiError,
  availabilityQuery,
  servicesQuery,
  staffQuery,
  type Booking,
  type Service,
  type Staff,
} from "../lib/api";
import { formatNaira } from "../lib/currency";

const searchSchema = z.object({
  service: z.string().optional(),
});

export const Route = createFileRoute("/book")({
  validateSearch: (search) => searchSchema.parse(search),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(servicesQuery()),
      context.queryClient.ensureQueryData(staffQuery()),
    ]),
  head: () => ({
    meta: [
      { title: "Book an Appointment — L'AURA" },
      { name: "description", content: "Reserve your session at L'AURA — skincare, treatments, massage, nails, hair." },
      { property: "og:title", content: "Book an Appointment — L'AURA" },
      { property: "og:description", content: "Reserve your session at L'AURA Atelier." },
    ],
  }),
  component: Book,
});

// Generate next 14 days
function nextDays(n = 14) {
  const days: { iso: string; label: string; dow: string }[] = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push({
      iso: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      dow: d.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }
  return days;
}

function Book() {
  const { service: preselected } = Route.useSearch();
  const navigate = useNavigate();
  const { data: services } = useSuspenseQuery(servicesQuery());
  const { data: staff } = useSuspenseQuery(staffQuery());
  const serviceById = (id: string) => services.find((s) => s.id === id);

  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState<string | undefined>(preselected);
  const [category, setCategory] = useState<Service["category"] | undefined>(
    preselected ? serviceById(preselected)?.category : undefined,
  );
  const [staffId, setStaffId] = useState<string | undefined>();
  const [date, setDate] = useState<string | undefined>();
  const [time, setTime] = useState<string | undefined>();
  const [details, setDetails] = useState({ name: "", email: "", phone: "" });
  const [confirmed, setConfirmed] = useState<Booking | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (preselected && !serviceId) {
      setServiceId(preselected);
      const s = serviceById(preselected);
      if (s) {
        setCategory(s.category);
        setStep(2);
      }
    }
  }, [preselected, serviceId]);

  const selectedService = useMemo(() => (serviceId ? serviceById(serviceId) : undefined), [serviceId]);
  const availableStaff = useMemo(
    () =>
      selectedService
        ? staff.filter((s) => s.specialties.includes(selectedService.category))
        : staff,
    [selectedService, staff],
  );
  const selectedStaff = useMemo(
    () => (staffId ? staff.find((s) => s.id === staffId) : undefined),
    [staffId, staff],
  );

  const days = useMemo(() => nextDays(14), []);

  const slotsQuery = useQuery({
    ...availabilityQuery(serviceId ?? "", date ?? "", staffId),
    enabled: Boolean(serviceId && date),
  });
  const slots = slotsQuery.data ?? [];

  const confirm = async () => {
    if (!selectedService || !selectedStaff || !date || !time) return;
    setSubmitting(true);
    setBookingError(null);
    try {
      const booking = await api.createBooking({
        serviceId: selectedService.id,
        staffId: selectedStaff.id,
        date,
        time,
        customer: { name: details.name, email: details.email, phone: details.phone },
      });
      setConfirmed(booking);
    } catch (err) {
      setBookingError(
        err instanceof ApiError ? err.message : "We couldn't confirm that slot. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Confirmed</p>
        <h1 className="mb-6 font-serif text-5xl italic">Your seat is held.</h1>
        <p className="mb-10 text-muted-foreground">
          A confirmation has been sent to <span className="text-foreground">{confirmed.customer.email}</span>.
        </p>
        <div className="mx-auto max-w-md space-y-4 border border-border p-8 text-left">
          <Row label="Service" value={confirmed.serviceName} />
          <Row label="Date" value={new Date(confirmed.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} />
          <Row label="Time" value={confirmed.time} />
          <Row label="With" value={confirmed.staffName} />
          <Row label="Total" value={formatNaira(confirmed.price)} />
        </div>
        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={() => {
              setConfirmed(null);
              setStep(1);
              setServiceId(undefined);
              setCategory(undefined);
              setStaffId(undefined);
              setDate(undefined);
              setTime(undefined);
              setDetails({ name: "", email: "", phone: "" });
              navigate({ to: "/book", search: {} });
            }}
            className="border border-foreground/20 px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-foreground hover:text-background"
          >
            Book another
          </button>
          <a
            href="/"
            className="bg-foreground px-6 py-3 text-[10px] uppercase tracking-widest text-background hover:bg-accent"
          >
            Return home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        Concierge
      </p>
      <h1 className="mb-4 font-serif text-6xl italic">Reserve your session.</h1>

      {/* Stepper */}
      <div className="my-12 flex items-center gap-6 border-y border-border py-6 text-[10px] uppercase tracking-[0.2em]">
        {["Service", "Date & Time", "Specialist", "Details"].map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <div key={label} className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 items-center justify-center border font-mono text-[11px] ${
                  active ? "border-foreground bg-foreground text-background" : done ? "border-accent text-accent" : "border-border text-muted-foreground"
                }`}
              >
                0{n}
              </span>
              <span className={active ? "text-foreground" : "text-muted-foreground"}>{label}</span>
              {i < 3 && <span className="hidden w-8 border-t border-border md:block" />}
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <div>
          <h2 className="mb-8 font-serif text-3xl italic">Choose a service.</h2>
          <div className="mb-8 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.2em]">
            {(["Skincare", "Treatments", "Massage", "Nails", "Hair"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`border px-4 py-2 transition-colors ${
                  category === c ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {services
              .filter((s) => !category || s.category === category)
              .map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setServiceId(s.id);
                    setStaffId(undefined);
                    setStep(2);
                  }}
                  className={`border p-6 text-left transition-colors ${
                    serviceId === s.id ? "border-foreground" : "border-border hover:border-foreground/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                        {s.category}
                      </p>
                      <h3 className="font-serif text-xl italic">{s.name}</h3>
                    </div>
                    <span className="font-mono text-sm">{formatNaira(s.price)}</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {s.duration} min — {s.description}
                  </p>
                </button>
              ))}
          </div>
        </div>
      )}

      {step === 2 && selectedService && (
        <div>
          <h2 className="mb-2 font-serif text-3xl italic">Pick a date and time.</h2>
          <p className="mb-8 text-sm text-muted-foreground">
            For {selectedService.name} — {selectedService.duration} min.
          </p>
          <div className="mb-10">
            <p className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">Date</p>
            <div className="flex flex-wrap gap-2">
              {days.map((d) => (
                <button
                  key={d.iso}
                  onClick={() => setDate(d.iso)}
                  className={`flex flex-col items-center border px-4 py-3 text-center ${
                    date === d.iso ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/40"
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-widest">{d.dow}</span>
                  <span className="mt-1 font-serif text-lg">{d.label}</span>
                </button>
              ))}
            </div>
          </div>

          {date && (
            <div className="mb-10">
              <p className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">Time</p>
              <div className="flex flex-wrap gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.time}
                    disabled={!slot.available}
                    onClick={() => setTime(slot.time)}
                    className={`border px-5 py-3 font-mono text-sm disabled:cursor-not-allowed disabled:line-through disabled:opacity-35 ${
                      time === slot.time ? "border-foreground bg-foreground text-background" : "border-border hover:enabled:border-foreground/40"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
                {slotsQuery.isPending && (
                  <p className="text-xs text-muted-foreground">Checking availability…</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              ← Back
            </button>
            <button
              disabled={!date || !time}
              onClick={() => setStep(3)}
              className="bg-foreground px-8 py-3 text-[10px] uppercase tracking-widest text-background disabled:opacity-40 hover:enabled:bg-accent"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && selectedService && (
        <div>
          <h2 className="mb-8 font-serif text-3xl italic">Choose your specialist.</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {availableStaff.map((s: Staff) => (
              <button
                key={s.id}
                onClick={() => setStaffId(s.id)}
                className={`overflow-hidden border text-left transition-colors ${
                  staffId === s.id ? "border-foreground" : "border-border hover:border-foreground/40"
                }`}
              >
                <div className="aspect-[4/5] overflow-hidden bg-stone-warm">
                  <img src={s.image} alt={s.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-xl italic">{s.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.role}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-10 flex justify-between">
            <button onClick={() => setStep(2)} className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
              ← Back
            </button>
            <button
              disabled={!staffId}
              onClick={() => setStep(4)}
              className="bg-foreground px-8 py-3 text-[10px] uppercase tracking-widest text-background disabled:opacity-40 hover:enabled:bg-accent"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 4 && selectedService && selectedStaff && date && time && (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-8 font-serif text-3xl italic">Your details.</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                confirm();
              }}
              className="space-y-6"
            >
              <Field label="Full name" value={details.name} onChange={(v) => setDetails((d) => ({ ...d, name: v }))} required />
              <Field label="Email" type="email" value={details.email} onChange={(v) => setDetails((d) => ({ ...d, email: v }))} required />
              <Field label="Phone" type="tel" value={details.phone} onChange={(v) => setDetails((d) => ({ ...d, phone: v }))} required />
              {bookingError && <p className="text-xs text-destructive">{bookingError}</p>}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-foreground px-8 py-3 text-[10px] uppercase tracking-widest text-background disabled:opacity-50 hover:enabled:bg-accent"
                >
                  {submitting ? "Confirming…" : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
          <div className="border border-border p-8">
            <p className="mb-6 text-[10px] uppercase tracking-widest text-muted-foreground">Summary</p>
            <Row label="Service" value={selectedService.name} />
            <Row label="Duration" value={`${selectedService.duration} min`} />
            <Row label="Date" value={new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} />
            <Row label="Time" value={time} />
            <Row label="With" value={selectedStaff.name} />
            <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
              <span className="text-[10px] uppercase tracking-widest">Total</span>
              <span className="font-mono text-lg">{formatNaira(selectedService.price)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full border-b border-border bg-transparent py-3 focus:border-foreground focus:outline-none"
      />
    </label>
  );
}
