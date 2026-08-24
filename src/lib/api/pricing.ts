// Pure pricing rules — the single source of truth for cart maths.
// Port these three functions verbatim when you move the logic server-side
// (Python/Go references live in docs/backend/).

import type { CartQuote, Money } from "./types";

export const CURRENCY = "NGN" as const;
export const FREE_SHIPPING_THRESHOLD: Money = 150_000;
export const FLAT_SHIPPING: Money = 8_000;

/** Coupon code -> fractional discount on subtotal. */
export const COUPONS: Record<string, number> = {
  AURA10: 0.1,
  AURA20: 0.2,
};

export const normalizeCoupon = (code?: string | null) =>
  (code ?? "").trim().toUpperCase();

export const couponRate = (code?: string | null): number =>
  COUPONS[normalizeCoupon(code)] ?? 0;

export const shippingFor = (subtotal: Money): Money =>
  subtotal <= 0 || subtotal > FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;

/**
 * Canonical quote. Deterministic and side-effect free so the same rules can
 * run in the browser (optimistic UI) and on the server (authoritative).
 */
export function quoteCart(
  lines: { price: Money; quantity: number }[],
  couponCode?: string | null,
): CartQuote {
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const rate = couponRate(couponCode);
  const discount = Math.round(subtotal * rate);
  const shipping = shippingFor(subtotal);
  const total = Math.max(0, subtotal - discount) + shipping;
  const normalized = normalizeCoupon(couponCode);

  return {
    currency: CURRENCY,
    subtotal,
    discount,
    shipping,
    total,
    couponApplied: rate > 0 ? normalized : null,
    couponValid: normalized.length === 0 ? true : rate > 0,
  };
}
