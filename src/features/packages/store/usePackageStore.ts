import { create } from "zustand";
import { Package } from "@features/packages/domain/package.types";

export type PackageState = {
  packages: Package[];
  currentSessionPackages: Package[];
  pendingCount: number;

  syncingPackageIds: string[];
  isSyncingSession: boolean;
  isSyncingPending: boolean;

  setPackages: (
    packages: Package[],
    pendingCount?: number,
  ) => void;
  setPendingCount: (count: number) => void;

  addToSession: (pkg: Package) => void;
  removeFromSession: (packageId: string) => void;
  setSessionPackages: (packages: Package[]) => void;
  resetSession: () => void;

  markPackageSyncing: (packageId: string) => void;
  unmarkPackageSyncing: (packageId: string) => void;

  setSyncingSession: (isSyncing: boolean) => void;
  setSyncingPending: (isSyncing: boolean) => void;

  clearUserState: () => void;
};

export const usePackageStore = create<PackageState>(
  (set) => ({
    packages: [],
    currentSessionPackages: [],
    pendingCount: 0,

    syncingPackageIds: [],
    isSyncingSession: false,
    isSyncingPending: false,

    setPackages: (packages, pendingCount) => {
      set((state) => ({
        packages,
        pendingCount:
          pendingCount !== undefined
            ? pendingCount
            : state.pendingCount,
      }));
    },

    setPendingCount: (pendingCount) => {
      set({ pendingCount });
    },

    addToSession: (pkg) => {
      set((state) => ({
        currentSessionPackages: [
          pkg,
          ...state.currentSessionPackages,
        ],
      }));
    },

    removeFromSession: (packageId) => {
      set((state) => ({
        currentSessionPackages:
          state.currentSessionPackages.filter(
            (pkg) =>
              pkg.id !== packageId &&
              pkg.code !== packageId,
          ),
      }));
    },

    setSessionPackages: (currentSessionPackages) => {
      set({ currentSessionPackages });
    },

    resetSession: () => {
      set({ currentSessionPackages: [] });
    },

    markPackageSyncing: (packageId) => {
      set((state) => ({
        syncingPackageIds: state.syncingPackageIds.includes(
          packageId,
        )
          ? state.syncingPackageIds
          : [...state.syncingPackageIds, packageId],
      }));
    },

    unmarkPackageSyncing: (packageId) => {
      set((state) => ({
        syncingPackageIds: state.syncingPackageIds.filter(
          (id) => id !== packageId,
        ),
      }));
    },

    setSyncingSession: (isSyncingSession) => {
      set({ isSyncingSession });
    },

    setSyncingPending: (isSyncingPending) => {
      set({ isSyncingPending });
    },

    clearUserState: () => {
      set({
        packages: [],
        currentSessionPackages: [],
        pendingCount: 0,
        syncingPackageIds: [],
        isSyncingSession: false,
        isSyncingPending: false,
      });
    },
  }),
);
