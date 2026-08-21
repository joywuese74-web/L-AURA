// REST implementation of LauraApi — point VITE_API_BASE_URL at your
// Python (FastAPI) or Go service and the whole app runs against it.
import type { LauraApi } from "./contract";
import {
  fromBookingRequest,
  fromCartLine,
  fromOrderRequest,
  toBooking,
  toCartQuote,
  toOrder,
  toProduct,
  toService,
  toStaff,
  toTimeSlot,
} from "./mappers";
import { ApiError, type ApiErrorShape } from "./types";
import type {
  BookingWire,
  CartQuoteWire,
  OrderWire,
  ProductWire,
  ServiceWire,
  StaffWire,
  TimeSlotWire,
} from "./wire";

type Query = Record<string, string | undefined>;

function buildUrl(baseUrl: string, path: string, query?: Query) {
  const url = new URL(`${baseUrl.replace(/\/$/, "")}${path}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, value);
  }
  return url.toString();
}

async function request<T>(
  baseUrl: string,
  path: string,
  init?: { method?: string; body?: unknown; query?: Query },
): Promise<T> {
  const response = await fetch(buildUrl(baseUrl, path, init?.query), {
    method: init?.method ?? "GET",
    headers: { "content-type": "application/json", accept: "application/json" },
    ...(init?.body === undefined ? {} : { body: JSON.stringify(init.body) }),
  });

  if (!response.ok) {
    let payload: Partial<ApiErrorShape> = {};
    try {
      payload = (await response.json()) as Partial<ApiErrorShape>;
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(
      response.status,
      payload.error ?? "request_failed",
      payload.message ?? `Request to ${path} failed (${response.status}).`,
      payload.details,
    );
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function createHttpApi(baseUrl: string): LauraApi {
  return {
    async listProducts(params) {
      const data = await request<ProductWire[]>(baseUrl, "/v1/products", {
        query: { category: params?.category },
      });
      return data.map(toProduct);
    },

    async getProduct(id) {
      try {
        return toProduct(
          await request<ProductWire>(baseUrl, `/v1/products/${encodeURIComponent(id)}`),
        );
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null;
        throw error;
      }
    },

    async listServices(params) {
      const data = await request<ServiceWire[]>(baseUrl, "/v1/services", {
        query: { category: params?.category },
      });
      return data.map(toService);
    },

    async listStaff(params) {
      const data = await request<StaffWire[]>(baseUrl, "/v1/staff", {
        query: { specialty: params?.specialty },
      });
      return data.map(toStaff);
    },

    async listAvailability({ serviceId, date, staffId }) {
      const data = await request<TimeSlotWire[]>(baseUrl, "/v1/availability", {
        query: { service_id: serviceId, date, staff_id: staffId },
      });
      return data.map(toTimeSlot);
    },

    async quoteCart({ lines, couponCode }) {
      const data = await request<CartQuoteWire>(baseUrl, "/v1/cart/quote", {
        method: "POST",
        body: {
          lines: lines.map(fromCartLine),
          ...(couponCode ? { coupon_code: couponCode } : {}),
        },
      });
      return toCartQuote(data);
    },

    async createOrder(input) {
      return toOrder(
        await request<OrderWire>(baseUrl, "/v1/orders", {
          method: "POST",
          body: fromOrderRequest(input),
        }),
      );
    },

    async createBooking(input) {
      return toBooking(
        await request<BookingWire>(baseUrl, "/v1/bookings", {
          method: "POST",
          body: fromBookingRequest(input),
        }),
      );
    },

    async listBookings({ email }) {
      const data = await request<BookingWire[]>(baseUrl, "/v1/bookings", {
        query: { email },
      });
      return data.map(toBooking);
    },
  };
}
