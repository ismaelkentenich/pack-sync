import React, {
  createContext,
  ReactNode,
  useMemo,
  useState,
} from "react";
import {
  ColorSchemeName,
  useColorScheme,
} from "react-native";
import { darkTheme, lightTheme } from "./appTheme";
import type { AppTheme } from "./types";

export type ThemePreference = "light" | "dark" | "system";

type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme: AppTheme;
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
};

export const ThemeContext = createContext<
  ThemeContextValue | undefined
>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
  initialPreference?: ThemePreference;
};

function resolveTheme(
  preference: ThemePreference,
  systemColorScheme: ColorSchemeName,
): ResolvedTheme {
  if (preference === "light") {
    return "light";
  }

  if (preference === "dark") {
    return "dark";
  }

  return systemColorScheme === "dark" ? "dark" : "light";
}

export function ThemeProvider({
  children,
  initialPreference = "system",
}: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();

  const [preference, setPreference] =
    useState<ThemePreference>(initialPreference);

  const resolvedTheme = resolveTheme(
    preference,
    systemColorScheme,
  );

  const theme =
    resolvedTheme === "dark" ? darkTheme : lightTheme;

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      preference,
      resolvedTheme,
      setPreference,
    }),
    [preference, resolvedTheme, theme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
