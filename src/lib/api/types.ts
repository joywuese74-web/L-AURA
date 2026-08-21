// ---------------------------------------------------------------------------
// Domain types (camelCase) used by the UI.
// The wire format (snake_case) lives in ./wire.ts — mapped in ./mappers.ts.
// Any backend (Python/FastAPI, Go, Node) only needs to satisfy the wire format.
// ---------------------------------------------------------------------------

export type ProductCategory =
  | "Serums"
  | "Cleansers"
  | "Moisturizers"
  | "Sunscreen"
  | "Body";

export type ServiceCategory =
  | "Skincare"
  | "Massage"
  | "Nails"
  | "Hair"
  | "Treatments";

export type Money = number; // minor-unit-free integer amount in NGN

export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: Money;
  rating: number;
  reviews: number;
  category: ProductCategory;
  image: string;
  gallery: string[];
  description: string;
  ingredients: string[];
  directions: string;
};

export type Service = {
  id: string;
  name: string;
  category: ServiceCategory;
  duration: number; // minutes
  price: Money;
  description: string;
};

export type Staff = {
  id: string;
  name: string;
  role: string;
  specialties: ServiceCategory[];
  image: string;
};

export type TimeSlot = {
  time: string; // "HH:MM", salon-local
  available: boolean;
};

export type CartLineInput = {
  productId: string;
  quantity: number;
};

export type CartQuote = {
  currency: "NGN";
  subtotal: Money;
  discount: Money;
  shipping: Money;
  total: Money;
  couponApplied: string | null;
  couponValid: boolean;
};

export type Customer = {
  name: string;
  email: string;
  phone: string;
};

export type ShippingAddress = {
  address: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
};

export type OrderRequest = {
  customer: Customer;
  shipping: ShippingAddress;
  lines: CartLineInput[];
  couponCode?: string;
  paymentMethod: "card" | "bank_transfer" | "mobile_money";
};

export type Order = {
  id: string;
  status: "pending" | "processing" | "delivered" | "cancelled";
  customer: Customer;
  quote: CartQuote;
  createdAt: string; // ISO 8601
};

export type BookingRequest = {
  serviceId: string;
  staffId: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  customer: Customer;
  notes?: string;
};

export type Booking = {
  id: string;
  status: "confirmed" | "cancelled" | "completed";
  serviceId: string;
  serviceName: string;
  price: Money;
  duration: number;
  staffId: string;
  staffName: string;
  date: string;
  time: string;
  customer: Customer;
  createdAt: string;
};

export type ApiErrorShape = {
  error: string;
  message: string;
  details?: unknown;
};

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
