import { authClient } from "@/lib/auth-client";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000").replace(/\/+$/, "");

export class ApiClientError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
  }
}

/* ---------- Bearer token (Better Auth JWT) cache ---------- */
let cached: { token: string; exp: number } | null = null;
let inflight: Promise<string | null> | null = null;

export function clearAuthToken() {
  cached = null;
  inflight = null;
}

function decodeExp(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp === "number" ? payload.exp * 1000 : Date.now() + 5 * 60_000;
  } catch {
    return Date.now() + 5 * 60_000;
  }
}

async function getToken(forceRefresh = false): Promise<string | null> {
  if (!forceRefresh && cached && cached.exp - Date.now() > 60_000) return cached.token;
  if (!inflight) {
    inflight = (async () => {
      const { data } = await authClient.token();
      if (!data?.token) return null;
      cached = { token: data.token, exp: decodeExp(data.token) };
      return data.token;
    })().finally(() => {
      inflight = null;
    });
  }
  return inflight;
}

type Query = Record<string, string | number | boolean | undefined | null>;

interface Options {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Query;
  auth?: boolean;
}

function buildUrl(path: string, query?: Query) {
  const qs = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  });
  const s = qs.toString();
  return `${API_URL}/api${path}${s ? `?${s}` : ""}`;
}

async function request(url: string, opts: Options, token: string | null) {
  const headers: Record<string, string> = {};
  let body: BodyInit | undefined;
  if (opts.body instanceof FormData) {
    body = opts.body;
  } else if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.body);
  }
  if (token) headers.Authorization = `Bearer ${token}`;
  return fetch(url, { method: opts.method ?? "GET", headers, body, cache: "no-store" });
}

export async function apiFetch<T>(path: string, opts: Options = {}): Promise<T> {
  const { auth = true } = opts;
  const url = buildUrl(path, opts.query);
  let token = auth ? await getToken() : null;
  if (auth && !token) throw new ApiClientError("Please sign in to continue", 401, "UNAUTHORIZED");

  let res: Response;
  try {
    res = await request(url, opts, token);
    if (auth && res.status === 401) {
      token = await getToken(true); // token may have just expired
      if (token) res = await request(url, opts, token);
    }
  } catch {
    throw new ApiClientError("Could not reach the server. Check your connection and try again.", 0, "NETWORK");
  }

  let json: { success?: boolean; message?: string; code?: string; data?: T } | null = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  if (!res.ok || json?.success === false) {
    throw new ApiClientError(json?.message ?? `Request failed (${res.status})`, res.status, json?.code);
  }
  return json?.data as T;
}
