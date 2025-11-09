import { create } from "zustand";
import {
  Package,
  insertPackage,
  updatePackageStatus,
  getAllPackages,
} from "@services/database/packages/packages";
import { PackageStatus, DeliveryStatus } from "@services/database/packages/enums";
import { useAuthStore } from "@store/auth/useAuthStore";
import { sendToWebhook } from "@services/webhook/sendToWebhook";

type PackageState = {
  packages: Package[];
  currentSessionPackages: Package[];
  loadPackages: () => void;
  scanPackage: (code: string) => void;
  changeStatus: (id: number, status: PackageStatus, clientName?: string) => void;
  resetSession: () => void;
  sendPackage: (pkg: Package, receiverName?: string) => Promise<void>;
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

  scanPackage: async (code) => {
    const { user } = useAuthStore.getState();
    if (!user?.id) return;
    const clientCode = user.id;

    const existing = getAllPackages(clientCode).find((p) => p.code === code);
    if (existing) return;

    const pkgToInsert: Package = {
      code,
      status: PackageStatus.COLETADO,
      deliveryStatus: DeliveryStatus.PENDING,
      clientCode,
      scanned_at: new Date().toISOString(),
    };

    const newPkg = insertPackage(pkgToInsert);
    set((state) => ({
      packages: [newPkg, ...state.packages],
      currentSessionPackages: [newPkg, ...state.currentSessionPackages],
    }));

    try {
      const result = await sendToWebhook(newPkg);
      if (!result.success) {
        console.warn(`Falha ao enviar pacote ${code} para o webhook`);
      }
    } catch (err) {
      console.error("Erro ao enviar webhook durante escaneamento:", err);
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

  sendPackage: async (pkg, receiverName?: string) => {
    const result = await sendToWebhook(pkg, receiverName);
    if (result.success) {
      const { user } = useAuthStore.getState();
      if (user?.id) {
        set({ packages: getAllPackages(user.id) });
      }
    }
  },
}));
