"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { school } from "@/lib/data";

export const palettes = [
  { name: "أخضر زمردي", hex: "#0f766e" },
  { name: "أزرق ملكي", hex: "#1d4ed8" },
  { name: "بنفسجي", hex: "#6d28d9" },
  { name: "عنابي", hex: "#be123c" },
  { name: "برتقالي", hex: "#c2410c" },
  { name: "رمادي داكن", hex: "#334155" },
];

function hexToRgb(hex: string): number[] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

type Ctx = {
  brand: string;
  setBrand: (hex: string) => void;
  schoolName: string;
  setSchoolName: (name: string) => void;
};

const ThemeCtx = createContext<Ctx>({
  brand: palettes[0].hex,
  setBrand: () => {},
  schoolName: school.name,
  setSchoolName: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [brand, setBrand] = useState(palettes[0].hex);
  const [schoolName, setSchoolName] = useState(school.name);

  useEffect(() => {
    const rgb = hexToRgb(brand);
    const dark = rgb.map((v) => Math.round(v * 0.78));
    const root = document.documentElement;
    root.style.setProperty("--brand", rgb.join(" "));
    root.style.setProperty("--brand-dark", dark.join(" "));
  }, [brand]);

  const value = useMemo(() => ({ brand, setBrand, schoolName, setSchoolName }), [brand, schoolName]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
