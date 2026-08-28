import { useContext } from "react";
import { lightTheme } from "./appTheme";
import { ThemeContext } from "./ThemeProvider";

export function useAppTheme() {
  const context = useContext(ThemeContext);

  return (
    context ?? {
      theme: lightTheme,
      preference: "light" as const,
      resolvedTheme: "light" as const,
      setPreference: () => undefined,
    }
  );
}
