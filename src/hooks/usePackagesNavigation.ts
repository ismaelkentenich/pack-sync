import { useRouter } from "expo-router";
import { Routes } from "@config/routes";
import type { Package } from "@features/packages/domain/package.types";

export function usePackagesNavigation() {
  const router = useRouter();

  return {
    navigate: (
      route:
        | typeof Routes.PackagesList
        | typeof Routes.PackageDetails,
      params?: { pkg: Package },
    ) => {
      if (route === Routes.PackageDetails && params) {
        router.navigate({
          pathname: "/packages/[code]",
          params: { code: params.pkg.code },
        });

        return;
      }

      router.navigate("/packages");
    },
  };
}
