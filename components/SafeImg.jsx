"use client";
import { FALLBACK_IMG } from "@/lib/api";
export default function SafeImg({ src, alt, fallback = FALLBACK_IMG, ...rest }) {
  return <img src={src || fallback} alt={alt} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallback; }} {...rest} />;
}
