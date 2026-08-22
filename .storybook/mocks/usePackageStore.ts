import { create } from "zustand";
import type { PackageStatus } from "../../src/features/packages/domain/package.enums";
import type { Package } from "../../src/features/packages/domain/package.types";

type MockPackageStore = {
  packages: Package[];

  syncingPackageIds: number[];

  changeStatus: (
    id: number,
    userId: string,
    status: PackageStatus,
    receiverName?: string,
  ) => {
    success: boolean;
  };

  loadPackages: (userId: string) => void;

  sendPackage: (
    pkg: Package,
    userId: string,
  ) => Promise<{
    success: boolean;
  }>;

  setSyncingPackageIds: (ids: number[]) => void;

  resetStorybookState: () => void;
};

export const usePackageStore = create<MockPackageStore>(
  (set) => ({
    packages: [],

    syncingPackageIds: [],

    changeStatus: () => ({
      success: true,
    }),

    loadPackages: () => {},

    sendPackage: async () => ({
      success: true,
    }),

    setSyncingPackageIds: (ids) => {
      set({
        syncingPackageIds: ids,
      });
    },

    resetStorybookState: () => {
      set({
        packages: [],
        syncingPackageIds: [],
      });
    },
  }),
);
