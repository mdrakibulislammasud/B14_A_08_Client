"use client";
import { useEffect, useState } from "react";
import Icon from "./Icons";
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => { setDark(document.documentElement.dataset.theme === "dark"); }, []);
  const toggle = () => {
    const next = !dark; setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  };
  return <button onClick={toggle} className="btn btn-ghost btn-sm btn-circle" aria-label="Toggle theme"><Icon n={dark ? "sun" : "moon"} className="w-5 h-5" /></button>;
}
