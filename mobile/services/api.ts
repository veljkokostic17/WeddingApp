import { API_BASE_URL } from "@/constants/api";

const TIMEOUT_MS = 10000;
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

/**
 * A request that reached the server and came back with a failing status.
 * Carries the status so callers can react to it (401 = bad credentials on the
 * login screen, a dead token everywhere else) instead of parsing the message.
 *
 * Note a timeout/network failure is NOT an ApiError — it never got a status.
 */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const headers: Record<string, string> = {};
  if (body != null) headers["Content-Type"] = "application/json";
  if (authToken != null) headers["Authorization"] = `Bearer ${authToken}`;

  try {
    const response = await fetch(API_BASE_URL + path, {
      method,
      headers,
      body: body != null ? JSON.stringify(body) : null,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ApiError(
        `Zahtev neuspešan: ${response.status} ${response.statusText}`,
        response.status,
      );
    }

    if (response.status === 204) return undefined as T;

    const data = await response.json();
    return data as T;
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error("Greška sa serverom. Proveri internet i pokušaj ponovo.");
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

export function apiGet<T>(path: string) {
  return request<T>("GET", path);
}

export function apiPost<T>(path: string, body?: unknown) {
  return request<T>("POST", path, body);
}

export function apiPut<T>(path: string, body?: unknown) {
  return request<T>("PUT", path, body);
}

export function apiDelete(path: string): Promise<void> {
  return request<void>("DELETE", path);
}
