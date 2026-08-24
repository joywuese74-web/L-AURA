import type { LauraApi } from "./contract";
import { createHttpApi } from "./http-adapter";
import { mockApi } from "./mock-adapter";

const baseUrl = import.meta.env["VITE_API_BASE_URL"] as string | undefined;

/**
 * The one object the UI talks to.
 * Set VITE_API_BASE_URL to your Python/Go service URL to switch backends.
 */
export const api: LauraApi = baseUrl ? createHttpApi(baseUrl) : mockApi;

export const usingRemoteBackend = Boolean(baseUrl);

export type { LauraApi };
export * from "./types";
export * from "./pricing";
export * from "./queries";
