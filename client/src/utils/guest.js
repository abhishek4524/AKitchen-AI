const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Simple guest id helper: sets a cookie `guest_id` if not present and returns it
export function uuidv4() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function ensureGuestId() {
  const name = "guest_id=";
  const cookies = document.cookie.split(";").map(c => c.trim());
  const existing = cookies.find(c => c.startsWith(name));
  if (existing) return existing.substring(name.length);

  const id = uuidv4();
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toUTCString();
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `guest_id=${encodeURIComponent(id)}; Path=/; Expires=${expires}; SameSite=Lax${secure}`;
  return id;
}

export function getGuestId() {
  const match = document.cookie.match(new RegExp("(^| )guest_id=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export async function trackGuestUsage(feature) {
  const guestId = ensureGuestId();
  const response = await fetch(`${API_BASE}/usage/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-guest-id": guestId },
    body: JSON.stringify({ feature }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.message || "Could not track guest usage");
  }

  return data;
}

export function buildGoogleAuthUrl(returnTo = window.location.pathname + window.location.search) {
  const base = import.meta.env.VITE_AUTH_GOOGLE_URL || `${API_URL}/auth/google`;
  const guestId = ensureGuestId();
  const url = new URL(base, window.location.origin);

  if (guestId) {
    url.searchParams.set("guestId", guestId);
  }

  if (returnTo?.startsWith("/")) {
    url.searchParams.set("returnTo", returnTo);
  }

  return url.toString();
}
