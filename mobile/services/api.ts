import { API_BASE_URL } from "@/constants/api";

const TIMEOUT_MS = 10000;

export async function apiGet<T>(path: string): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const response = await fetch(API_BASE_URL + path, { signal: controller.signal });

        if (!response.ok) {
            throw new Error(`Zahtev neuspešan: ${response.status} ${response.statusText}`);
        }

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
