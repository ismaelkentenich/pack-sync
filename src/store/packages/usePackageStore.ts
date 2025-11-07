import { create } from "zustand";
import {
  Package,
  insertPackage,
  updatePackageStatus,
  getAllPackages,
} from "src/services/database/packages/packages";
import { PackageStatus, DeliveryStatus } from "src/services/database/packages/enums";

type PackageState = {
  packages: Package[];
  currentSessionPackages: Package[];
  loadPackages: () => void;
  scanPackage: (code: string) => void;
  changeStatus: (id: number, status: PackageStatus, clientName?: string) => void;
  resetSession: () => void;
};

export const usePackageStore = create<PackageState>((set, get) => ({
  packages: [],
  currentSessionPackages: [],

  loadPackages: () => {
    const pkgs = getAllPackages();
    set({ packages: pkgs });
  },

  scanPackage: (code) => {
    const existing = getAllPackages().find((p) => p.code === code);
    if (!existing) {
      const newPkg: Package = {
        code,
        status: PackageStatus.COLETADO,
        deliveryStatus: DeliveryStatus.PENDING,
        scanned_at: new Date().toISOString(),
      };
      insertPackage(newPkg);

      set((state) => ({
        packages: [newPkg, ...state.packages],
        currentSessionPackages: [newPkg, ...state.currentSessionPackages],
      }));
    }
  },

  changeStatus: (id, status, clientName) => {
    updatePackageStatus(id, status, clientName);
    set({ packages: getAllPackages() });
  },

  resetSession: () => set({ currentSessionPackages: [] }),
}));
