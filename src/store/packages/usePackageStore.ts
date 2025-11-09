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
import { normalizeText } from "@utils/string";

type Feedback = {
  loading: boolean;
  success?: string;
  error?: string;
};

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
  searchTerm: string;
  statusFilter: string;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  filteredPackages: () => Package[];
  feedback: Feedback;
  setFeedback: (feedback: Feedback) => void;
  sendAllCurrentSessionPackages: () => Promise<void>;
};

export const usePackageStore = create<PackageState>((set, get) => ({
  packages: [],
  currentSessionPackages: [],
  pendingCount: 0,
  searchTerm: "",
  statusFilter: "",
  feedback: { loading: false },

  setFeedback: (feedback) => set({ feedback }),

  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setStatusFilter: (status: string) => set({ statusFilter: status }),

  loadPackages: () => {
    const { user } = useAuthStore.getState();
    if (!user?.uid) return;
    const pkgs = getAllPackages(user.uid);
    const pending = pkgs.filter((p) => p.deliveryStatus === DeliveryStatus.PENDING).length;
    set({ packages: pkgs, pendingCount: pending });
  },

  scanPackage: async (code) => {
    const { user } = useAuthStore.getState();
    if (!user?.uid) return;

    set({ feedback: { loading: true } });
    try {
      const existing = getAllPackages(user.uid).find((p) => p.code === code);
      if (existing) throw new Error("Pacote já escaneado");

      const pkgToInsert: Package = {
        code,
        status: PackageStatus.COLETADO,
        deliveryStatus: DeliveryStatus.PENDING,
        clientCode: user.uid,
        scanned_at: new Date().toISOString(),
      };

      const newPkg = insertPackage(pkgToInsert);
      set((state) => ({
        packages: [newPkg, ...state.packages],
        currentSessionPackages: [newPkg, ...state.currentSessionPackages],
        pendingCount: state.pendingCount + 1,
      }));

      get().loadPackages();
      set({ feedback: { loading: false, success: `Pacote ${code} escaneado com sucesso!` } });
    } catch (err: any) {
      console.warn(err.message);
      set({ feedback: { loading: false, error: err.message } });
    }
  },

  sendAllCurrentSessionPackages: async () => {
    const { currentSessionPackages } = get();
    if (currentSessionPackages.length === 0) return;

    set({ feedback: { loading: true } });
    try {
      for (const pkg of currentSessionPackages) {
        await get().sendPackage(pkg);
      }
      set({ feedback: { loading: false, success: "Todos os pacotes enviados com sucesso!" } });
      get().resetSession();
    } catch (err: any) {
      console.warn(err.message);
      set({ feedback: { loading: false, error: "Falha ao enviar alguns pacotes." } });
    }
  },

  filteredPackages: () => {
    const term = normalizeText(get().searchTerm);
    const status = get().statusFilter;
    return get().packages.filter((pkg) => {
      const codeMatch = normalizeText(pkg.code).includes(term);
      const statusMatch = status ? pkg.status === status : true;
      return codeMatch && statusMatch;
    });
  },

  changeStatus: (id, status, receiverName?: string) => {
    const { user } = useAuthStore.getState();
    if (!user?.uid) return;
    const clientCode = user.uid;

    updatePackageStatus(id, status, clientCode, receiverName);
    get().loadPackages();
  },

  resetSession: () => set({ currentSessionPackages: [] }),

  sendPackage: async (pkg, receiverName?: string) => {
    const result = await sendToWebhook(pkg, receiverName);
    const { user } = useAuthStore.getState();
    if (user?.uid) {
      get().loadPackages();
    }
    if (!result.success) {
      console.warn(`Falha ao enviar pacote ${pkg.code}, mantido como pendente.`);
    }
  },

  syncPendingPackages: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.uid) return;
    const allPkgs = getAllPackages(user.uid);
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
