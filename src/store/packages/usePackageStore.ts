import { create } from "zustand";
import {
  Package,
  insertPackage,
  updatePackageStatus,
  getAllPackages,
} from "@services/database/packages/packages";
import { PackageStatus, DeliveryStatus } from "@services/database/packages/enums";
import { useAuthStore } from "@store/auth/useAuthStore";

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
    const { user } = useAuthStore.getState();
    if (!user?.id) return;
    const pkgs = getAllPackages(user?.id);
    set({ packages: pkgs });
  },

  scanPackage: (code) => {
    const { user } = useAuthStore.getState();
    if (!user?.id) return;
    const clientCode = user?.id;

    const existing = getAllPackages(clientCode).find((p) => p.code === code);
    if (!existing) {
      const newPkg: Package = {
        code,
        status: PackageStatus.COLETADO,
        deliveryStatus: DeliveryStatus.PENDING,
        clientCode,
        scanned_at: new Date().toISOString(),
      };
      insertPackage(newPkg);

      set((state) => ({
        packages: [newPkg, ...state.packages],
        currentSessionPackages: [newPkg, ...state.currentSessionPackages],
      }));
    }
  },

  changeStatus: (id, status) => {
    const { user } = useAuthStore.getState();
    if (!user?.id) return;
    const clientCode = user?.id;
    updatePackageStatus(id, status, clientCode);
    set({ packages: getAllPackages(clientCode) });
  },

  resetSession: () => set({ currentSessionPackages: [] }),
}));
