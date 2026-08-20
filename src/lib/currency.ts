// All prices across the site are stored and displayed in Nigerian Naira.
export const formatNaira = (amount: number) =>
  `₦${Math.round(amount).toLocaleString("en-NG")}`;

// Free shipping threshold and flat rate, in Naira.
export const FREE_SHIPPING_THRESHOLD = 150_000;
export const FLAT_SHIPPING = 8_000;
