import type {
  Booking,
  BookingRequest,
  CartLineInput,
  CartQuote,
  Order,
  OrderRequest,
  Product,
  ProductCategory,
  Service,
  ServiceCategory,
  Staff,
  TimeSlot,
} from "./types";
import type {
  BookingRequestWire,
  BookingWire,
  CartLineWire,
  CartQuoteWire,
  OrderRequestWire,
  OrderWire,
  ProductWire,
  ServiceWire,
  StaffWire,
  TimeSlotWire,
} from "./wire";

// --- wire -> domain -------------------------------------------------------

export const toProduct = (w: ProductWire): Product => ({
  id: w.id,
  name: w.name,
  tagline: w.tagline,
  price: w.price,
  rating: w.rating,
  reviews: w.review_count,
  category: w.category as ProductCategory,
  image: w.image_url,
  gallery: w.gallery_urls,
  description: w.description,
  ingredients: w.ingredients,
  directions: w.directions,
});

export const toService = (w: ServiceWire): Service => ({
  id: w.id,
  name: w.name,
  category: w.category as ServiceCategory,
  duration: w.duration_minutes,
  price: w.price,
  description: w.description,
});

export const toStaff = (w: StaffWire): Staff => ({
  id: w.id,
  name: w.name,
  role: w.role,
  specialties: w.specialties as ServiceCategory[],
  image: w.image_url,
});

export const toTimeSlot = (w: TimeSlotWire): TimeSlot => ({
  time: w.time,
  available: w.available,
});

export const toCartQuote = (w: CartQuoteWire): CartQuote => ({
  currency: "NGN",
  subtotal: w.subtotal,
  discount: w.discount,
  shipping: w.shipping,
  total: w.total,
  couponApplied: w.coupon_applied,
  couponValid: w.coupon_valid,
});

export const toOrder = (w: OrderWire): Order => ({
  id: w.id,
  status: w.status as Order["status"],
  customer: w.customer,
  quote: toCartQuote(w.quote),
  createdAt: w.created_at,
});

export const toBooking = (w: BookingWire): Booking => ({
  id: w.id,
  status: w.status as Booking["status"],
  serviceId: w.service_id,
  serviceName: w.service_name,
  price: w.price,
  duration: w.duration_minutes,
  staffId: w.staff_id,
  staffName: w.staff_name,
  date: w.date,
  time: w.time,
  customer: w.customer,
  createdAt: w.created_at,
});

// --- domain -> wire -------------------------------------------------------

export const fromCartLine = (l: CartLineInput): CartLineWire => ({
  product_id: l.productId,
  quantity: l.quantity,
});

export const fromOrderRequest = (r: OrderRequest): OrderRequestWire => ({
  customer: r.customer,
  shipping: {
    address: r.shipping.address,
    city: r.shipping.city,
    state: r.shipping.state,
    ...(r.shipping.postalCode ? { postal_code: r.shipping.postalCode } : {}),
    country: r.shipping.country,
  },
  lines: r.lines.map(fromCartLine),
  ...(r.couponCode ? { coupon_code: r.couponCode } : {}),
  payment_method: r.paymentMethod,
});

export const fromBookingRequest = (r: BookingRequest): BookingRequestWire => ({
  service_id: r.serviceId,
  staff_id: r.staffId,
  date: r.date,
  time: r.time,
  customer: r.customer,
  ...(r.notes ? { notes: r.notes } : {}),
});
