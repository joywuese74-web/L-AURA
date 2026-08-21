import { queryOptions } from "@tanstack/react-query";

import { api } from "./index";
import type { ProductCategory, ServiceCategory } from "./types";

export const queryKeys = {
  products: (category?: ProductCategory) => ["products", category ?? "all"] as const,
  product: (id: string) => ["product", id] as const,
  services: (category?: ServiceCategory) => ["services", category ?? "all"] as const,
  staff: (specialty?: ServiceCategory) => ["staff", specialty ?? "all"] as const,
  availability: (serviceId: string, date: string, staffId?: string) =>
    ["availability", serviceId, date, staffId ?? "any"] as const,
};

export const productsQuery = (category?: ProductCategory) =>
  queryOptions({
    queryKey: queryKeys.products(category),
    queryFn: () => api.listProducts(category ? { category } : undefined),
  });

export const productQuery = (id: string) =>
  queryOptions({
    queryKey: queryKeys.product(id),
    queryFn: () => api.getProduct(id),
  });

export const servicesQuery = (category?: ServiceCategory) =>
  queryOptions({
    queryKey: queryKeys.services(category),
    queryFn: () => api.listServices(category ? { category } : undefined),
  });

export const staffQuery = (specialty?: ServiceCategory) =>
  queryOptions({
    queryKey: queryKeys.staff(specialty),
    queryFn: () => api.listStaff(specialty ? { specialty } : undefined),
  });

export const availabilityQuery = (
  serviceId: string,
  date: string,
  staffId?: string,
) =>
  queryOptions({
    queryKey: queryKeys.availability(serviceId, date, staffId),
    queryFn: () =>
      api.listAvailability({ serviceId, date, ...(staffId ? { staffId } : {}) }),
  });
