"use client";

import { ThemeProvider as NextThemeProvider } from "@/app/context/theme-context";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return <NextThemeProvider>{children}</NextThemeProvider>;
}
