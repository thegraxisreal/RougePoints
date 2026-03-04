"use client";

import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("rp-theme") as Theme | null;
    const initial = stored ?? "dark";
    applyTheme(initial);
    setTheme(initial);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
    localStorage.setItem("rp-theme", next);
  }

  return { theme, toggle };
}

function applyTheme(t: Theme) {
  document.documentElement.setAttribute("data-theme", t);
}
