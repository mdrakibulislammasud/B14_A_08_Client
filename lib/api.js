import { authClient } from "./auth-client";
const BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

const svg = (s) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s);
export const FALLBACK_IMG = svg('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d8f73"/><stop offset="1" stop-color="#6366f1"/></linearGradient></defs><rect width="800" height="500" fill="url(#g)"/><text x="400" y="265" font-family="Arial,sans-serif" font-weight="bold" font-size="44" fill="#ffffff" text-anchor="middle">Neighbourly</text></svg>');
export const FALLBACK_AVATAR = svg('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#0d8f73"/><circle cx="40" cy="31" r="14" fill="#fff"/><path d="M12 76c3-18 15-26 28-26s25 8 28 26z" fill="#fff"/></svg>');

export async function api(path, opts = {}, auth = false) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const res = await authClient.token();
    const token = res?.data?.token;
    if (!token) throw new Error("Please log in to continue.");
    headers.Authorization = `Bearer ${token}`;
  }
  let res;
  try { res = await fetch(BASE + path, { ...opts, headers, cache: "no-store" }); }
  catch { throw new Error("Cannot reach the server. Check your connection and try again."); }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Something went wrong. Try again.");
  return json;
}

const pad = (n) => String(n).padStart(2, "0");
// Today in the visitor's own time zone, as YYYY-MM-DD
export const localToday = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
export const localTomorrow = () => { const d = new Date(); d.setDate(d.getDate() + 1); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
export const isUpcoming = (d) => String(d).slice(0, 10) >= localToday();
export const fmtDate = (d) => new Date(String(d).slice(0, 10) + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const toDay = (d) => new Date(String(d).slice(0, 10) + "T00:00:00");
// e.g. "Sun, Nov 15, 2026" – used for event dates
export const fmtDay = (d) => toDay(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
// Same format for a full timestamp such as when someone joined
export const fmtStamp = (d) => new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
