import type { AuthResponse } from "@/types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function absoluteUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL.replace(/\/api$/, "")}${path}`;
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("jobswipe_token");
}

export function setToken(token: string) {
  window.localStorage.setItem("jobswipe_token", token);
}

export function clearToken() {
  window.localStorage.removeItem("jobswipe_token");
}

export async function apiFetch<T>(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ApiError(data?.message ?? "Request failed.", response.status);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function login(email: string, password: string) {
  const data = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  setToken(data.token);
  return data;
}

export async function register(payload: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "JOB_SEEKER" | "RECRUITER";
  acceptedTerms: boolean;
}) {
  const data = await apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  setToken(data.token);
  return data;
}
