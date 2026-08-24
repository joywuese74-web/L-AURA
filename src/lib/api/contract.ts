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

/**
 * Every data read/write in the UI goes through this interface.
 * Swap the implementation (mock <-> HTTP) without touching a single component.
 *
 * HTTP mapping (see docs/api/openapi.yaml):
 *   listProducts      GET  /v1/products?category=
 *   getProduct        GET  /v1/products/{id}
 *   listServices      GET  /v1/services?category=
 *   listStaff         GET  /v1/staff?specialty=
 *   listAvailability  GET  /v1/availability?service_id=&date=&staff_id=
 *   quoteCart         POST /v1/cart/quote
 *   createOrder       POST /v1/orders
 *   createBooking     POST /v1/bookings
 *   listBookings      GET  /v1/bookings?email=
 */
export interface LauraApi {
  listProducts(params?: { category?: ProductCategory }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | null>;

  listServices(params?: { category?: ServiceCategory }): Promise<Service[]>;
  listStaff(params?: { specialty?: ServiceCategory }): Promise<Staff[]>;

  listAvailability(params: {
    serviceId: string;
    date: string;
    staffId?: string;
  }): Promise<TimeSlot[]>;

  quoteCart(input: {
    lines: (CartLineInput & { price?: number })[];
    couponCode?: string;
  }): Promise<CartQuote>;

  createOrder(input: OrderRequest): Promise<Order>;

  createBooking(input: BookingRequest): Promise<Booking>;
  listBookings(params: { email: string }): Promise<Booking[]>;
}
