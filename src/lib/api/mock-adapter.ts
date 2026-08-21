// In-memory / localStorage implementation of LauraApi.
// Used until VITE_API_BASE_URL points at a real Python/Go service.
import { products as productSeed } from "../products";
import { services as serviceSeed } from "../services";
import { staff as staffSeed } from "../staff";
import type { LauraApi } from "./contract";
import { quoteCart } from "./pricing";
import { ApiError, type Booking, type Order } from "./types";

const BUSINESS_HOURS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
const BOOKINGS_KEY = "laura_bookings_v1";
const ORDERS_KEY = "laura_orders_v1";

const readLocal = <T>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
};

const writeLocal = <T>(key: string, list: T[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    /* storage unavailable (SSR / private mode) */
  }
};

const priceOf = (productId: string) =>
  productSeed.find((p) => p.id === productId)?.price ?? 0;

export const mockApi: LauraApi = {
  async listProducts(params) {
    return params?.category
      ? productSeed.filter((p) => p.category === params.category)
      : productSeed;
  },

  async getProduct(id) {
    return productSeed.find((p) => p.id === id) ?? null;
  },

  async listServices(params) {
    return params?.category
      ? serviceSeed.filter((s) => s.category === params.category)
      : serviceSeed;
  },

  async listStaff(params) {
    return params?.specialty
      ? staffSeed.filter((s) => s.specialties.includes(params.specialty!))
      : staffSeed;
  },

  async listAvailability({ date }) {
    // Deterministic pseudo-availability so the UI exercises unavailable slots.
    const seed = [...date].reduce((n, c) => n + c.charCodeAt(0), 0);
    return BUSINESS_HOURS.map((time, i) => ({
      time,
      available: (seed + i * 7) % 11 !== 0,
    }));
  },

  async quoteCart({ lines, couponCode }) {
    return quoteCart(
      lines.map((l) => ({
        price: l.price ?? priceOf(l.productId),
        quantity: l.quantity,
      })),
      couponCode,
    );
  },

  async createOrder(input) {
    if (input.lines.length === 0) {
      throw new ApiError(422, "empty_cart", "Your bag is empty.");
    }
    const quote = await mockApi.quoteCart({
      lines: input.lines,
      ...(input.couponCode ? { couponCode: input.couponCode } : {}),
    });
    const order: Order = {
      id: `AUR-${Date.now().toString(36).toUpperCase()}`,
      status: "pending",
      customer: input.customer,
      quote,
      createdAt: new Date().toISOString(),
    };
    writeLocal(ORDERS_KEY, [...readLocal<Order>(ORDERS_KEY), order]);
    return order;
  },

  async createBooking(input) {
    const service = serviceSeed.find((s) => s.id === input.serviceId);
    const member = staffSeed.find((s) => s.id === input.staffId);
    if (!service || !member) {
      throw new ApiError(404, "not_found", "Service or specialist not found.");
    }
    const booking: Booking = {
      id: `bk_${Date.now().toString(36)}`,
      status: "confirmed",
      serviceId: service.id,
      serviceName: service.name,
      price: service.price,
      duration: service.duration,
      staffId: member.id,
      staffName: member.name,
      date: input.date,
      time: input.time,
      customer: input.customer,
      createdAt: new Date().toISOString(),
    };
    writeLocal(BOOKINGS_KEY, [...readLocal<Booking>(BOOKINGS_KEY), booking]);
    return booking;
  },

  async listBookings({ email }) {
    return readLocal<Booking>(BOOKINGS_KEY).filter(
      (b) => b.customer.email.toLowerCase() === email.toLowerCase(),
    );
  },
};
