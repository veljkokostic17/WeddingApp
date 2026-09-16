import { API_BASE_URL } from "@/constants/api";
import { ApiError } from "./api-error";

const TIMEOUT_MS = 10000;

let authToken: string | null = null;
export function setAuthToken(token: string | null) {
  authToken = token;
}

let onUnauthorized: (() => void) | null = null;
export function setOnUnauthorized(handler: (() => void) | null) {
  onUnauthorized = handler;
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
      //Token expired mid usage case
      if (response.status === 401 && authToken != null) onUnauthorized?.();
      //
      // An error response isn't guaranteed to be JSON, so a failed parse just
      // means "no body to report" rather than swallowing the real status.
      const errorBody = await response.json().catch(() => null);
      throw new ApiError(
        `Zahtev neuspešan: ${response.status} ${response.statusText}`,
        response.status,
        errorBody,
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

// Verbs

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
