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
  pendingCount: number;
  loadPackages: () => void;
  scanPackage: (code: string) => void;
  changeStatus: (id: number, status: PackageStatus, clientName?: string) => void;
  resetSession: () => void;
  sendPackage: (pkg: Package, receiverName?: string) => Promise<void>;
  syncPendingPackages: () => Promise<void>;
};

export const usePackageStore = create<PackageState>((set, get) => ({
  packages: [],
  currentSessionPackages: [],
  pendingCount: 0,

  loadPackages: () => {
    const { user } = useAuthStore.getState();
    if (!user?.id) return;
    const pkgs = getAllPackages(user.id);
    const pending = pkgs.filter((p) => p.deliveryStatus === DeliveryStatus.PENDING).length;
    set({ packages: pkgs, pendingCount: pending });
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
      pendingCount: state.pendingCount + 1,
    }));

    try {
      const result = await sendToWebhook(newPkg);
      if (result.success) {
        get().loadPackages();
      } else {
        console.warn(`Falha ao enviar pacote ${code} para o webhook`);
      }
    } catch (err) {
      console.error("Erro ao enviar webhook durante escaneamento:", err);
    }
  },

  changeStatus: (id, status) => {
    const { user } = useAuthStore.getState();
    if (!user?.id) return;
    const clientCode = user.id;
    updatePackageStatus(id, status, clientCode);
    get().loadPackages();
  },

  resetSession: () => set({ currentSessionPackages: [] }),

  sendPackage: async (pkg, receiverName?: string) => {
    const result = await sendToWebhook(pkg, receiverName);
    const { user } = useAuthStore.getState();
    if (user?.id) {
      get().loadPackages();
    }
    if (!result.success) {
      console.warn(`Falha ao enviar pacote ${pkg.code}, mantido como pendente.`);
    }
  },

  syncPendingPackages: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.id) return;
    const allPkgs = getAllPackages(user.id);
    const pendings = allPkgs.filter((p) => p.deliveryStatus === DeliveryStatus.PENDING);

    if (pendings.length === 0) {
      console.log("Nenhum pacote pendente para sincronizar.");
      return;
    }

    console.log(`Tentando reenviar ${pendings.length} pacotes pendentes...`);

    for (const pkg of pendings) {
      const result = await sendToWebhook(pkg);
      if (!result.success) {
        console.warn(`Falha ao reenviar pacote ${pkg.code}`);
      }
    }

    get().loadPackages();
  },
}));
