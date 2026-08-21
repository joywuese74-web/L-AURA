// Wire format (snake_case JSON) — this is the exact contract a Python or Go
// backend must implement. See docs/api/openapi.yaml.

export type ProductWire = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  rating: number;
  review_count: number;
  category: string;
  image_url: string;
  gallery_urls: string[];
  description: string;
  ingredients: string[];
  directions: string;
};

export type ServiceWire = {
  id: string;
  name: string;
  category: string;
  duration_minutes: number;
  price: number;
  description: string;
};

export type StaffWire = {
  id: string;
  name: string;
  role: string;
  specialties: string[];
  image_url: string;
};

export type TimeSlotWire = {
  time: string;
  available: boolean;
};

export type CartLineWire = {
  product_id: string;
  quantity: number;
};

export type CartQuoteWire = {
  currency: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon_applied: string | null;
  coupon_valid: boolean;
};

export type CustomerWire = {
  name: string;
  email: string;
  phone: string;
};

export type ShippingAddressWire = {
  address: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
};

export type OrderRequestWire = {
  customer: CustomerWire;
  shipping: ShippingAddressWire;
  lines: CartLineWire[];
  coupon_code?: string;
  payment_method: string;
};

export type OrderWire = {
  id: string;
  status: string;
  customer: CustomerWire;
  quote: CartQuoteWire;
  created_at: string;
};

export type BookingRequestWire = {
  service_id: string;
  staff_id: string;
  date: string;
  time: string;
  customer: CustomerWire;
  notes?: string;
};

export type BookingWire = {
  id: string;
  status: string;
  service_id: string;
  service_name: string;
  price: number;
  duration_minutes: number;
  staff_id: string;
  staff_name: string;
  date: string;
  time: string;
  customer: CustomerWire;
  created_at: string;
};
