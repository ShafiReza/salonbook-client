import type { Service } from "@/types";
import { API_URL } from "./api";

/** Server-side fetch used by the home page (Server Component). */
export async function fetchFeaturedServices(limit = 6): Promise<{ services: Service[]; error: boolean }> {
  try {
    const res = await fetch(`${API_URL}/api/services?limit=${limit}&sort=newest`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as { data: { items: Service[] } };
    return { services: json.data.items, error: false };
  } catch {
    return { services: [], error: true };
  }
}
