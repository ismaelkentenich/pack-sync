import { useRouter } from "expo-router";
import { Routes } from "@config/routes";

export function useMainTabNavigation() {
  const router = useRouter();

  return {
    navigate: (
      route:
        | typeof Routes.Home
        | typeof Routes.Scan
        | typeof Routes.Packages
        | typeof Routes.Menu,
    ) => {
      const pathname =
        route === Routes.Home
          ? "/"
          : route === Routes.Scan
            ? "/scanner"
            : route === Routes.Packages
              ? "/packages"
              : "/menu";

      router.navigate(pathname);
    },
  };
}
