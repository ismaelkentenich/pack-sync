import type { PackageState } from "./usePackageStore";
import type { Package } from "@features/packages/domain/package.types";

export const selectPackages = (state: PackageState) =>
  state.packages;

export const selectCurrentSessionPackages = (
  state: PackageState,
) => state.currentSessionPackages;

export const selectPendingCount = (state: PackageState) =>
  state.pendingCount;

export const selectSyncingPackageIds = (
  state: PackageState,
) => state.syncingPackageIds;

export const selectIsSyncingSession = (
  state: PackageState,
) => state.isSyncingSession;

export const selectIsSyncingPending = (
  state: PackageState,
) => state.isSyncingPending;

export const selectPackagesCount = (state: PackageState) =>
  state.packages.length;

export const selectPackageByCode =
  (code?: string) => (state: PackageState) =>
    code
      ? state.packages.find((item) => item.code === code)
      : undefined;

export const selectRemoveFromSession = (
  state: PackageState,
) => state.removeFromSession;

export const selectResetSession = (state: PackageState) =>
  state.resetSession;

export function selectFilteredPackages(
  packages: Package[],
  searchTerm: string,
  statusFilter: string,
): Package[] {
  const normalizedSearchTerm = searchTerm
    .trim()
    .toLowerCase();

  return packages.filter((pkg) => {
    const matchesSearch =
      normalizedSearchTerm.length === 0 ||
      pkg.code.toLowerCase().includes(normalizedSearchTerm);

    const matchesStatus =
      statusFilter === "" ||
      statusFilter === "all" ||
      pkg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
}
