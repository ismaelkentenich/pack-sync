import { PackageStatus } from "@infrastructure/database/packages/enums";
import { Package } from "@features/packages/domain/package.types";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { create } from "zustand";
import { packageService } from "@features/packages/services/PackageService";

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
  changeStatus: (
    id: number,
    status: PackageStatus,
    clientName?: string,
  ) => void;
  resetSession: () => void;
  sendPackage: (
    pkg: Package,
    receiverName?: string,
  ) => Promise<void>;
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

export const usePackageStore = create<PackageState>(
  (set, get) => ({
    packages: [],
    currentSessionPackages: [],
    pendingCount: 0,
    searchTerm: "",
    statusFilter: "",
    feedback: { loading: false },

    setFeedback: (feedback) => set({ feedback }),

    setSearchTerm: (term: string) =>
      set({ searchTerm: term }),
    setStatusFilter: (status: string) =>
      set({ statusFilter: status }),

    loadPackages: () => {
      const { user } = useAuthStore.getState();
      if (!user?.uid) return;
      const pkgs = packageService.getAllPackages(user.uid);
      const pending = packageService.getPendingCount(
        user.uid,
      );
      set({ packages: pkgs, pendingCount: pending });
    },

    scanPackage: async (code) => {
      const { user } = useAuthStore.getState();
      if (!user?.uid) return;

      set({ feedback: { loading: true } });
      try {
        const newPkg = await packageService.scanPackage(
          code,
          user.uid,
        );
        set((state) => ({
          packages: [newPkg, ...state.packages],
          currentSessionPackages: [
            newPkg,
            ...state.currentSessionPackages,
          ],
          pendingCount: state.pendingCount + 1,
        }));

        get().loadPackages();
        set({
          feedback: {
            loading: false,
            success: `Pacote ${code} escaneado com sucesso!`,
          },
        });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Erro ao escanear pacote";
        console.warn(message);
        set({
          feedback: { loading: false, error: message },
        });
      }
    },

    sendAllCurrentSessionPackages: async () => {
      const { currentSessionPackages } = get();
      if (currentSessionPackages.length === 0) return;

      set({ feedback: { loading: true } });
      try {
        const result =
          await packageService.sendMultiplePackages(
            currentSessionPackages,
          );

        if (result.success) {
          set({
            feedback: {
              loading: false,
              success:
                "Todos os pacotes enviados com sucesso!",
            },
          });
        } else {
          set({
            feedback: {
              loading: false,
              error:
                result.error ??
                "Falha ao enviar alguns pacotes.",
            },
          });
        }

        get().resetSession();
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Erro ao enviar pacotes";
        console.warn(message);
        set({
          feedback: {
            loading: false,
            error: "Falha ao enviar alguns pacotes.",
          },
        });
      }
    },

    filteredPackages: () => {
      return packageService.filterPackages(
        get().packages,
        get().searchTerm,
        get().statusFilter,
      );
    },

    changeStatus: (id, status, receiverName?: string) => {
      const { user } = useAuthStore.getState();
      if (!user?.uid) return;

      try {
        packageService.changePackageStatus(
          id,
          status,
          user.uid,
          receiverName,
        );
        get().loadPackages();
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Erro ao atualizar status";
        console.warn(message);
        set({
          feedback: { loading: false, error: message },
        });
      }
    },

    resetSession: () => set({ currentSessionPackages: [] }),

    sendPackage: async (pkg, receiverName?: string) => {
      const result =
        await packageService.sendPackageToWebhook(
          pkg,
          receiverName,
        );
      const { user } = useAuthStore.getState();
      if (user?.uid) {
        get().loadPackages();
      }
      if (!result.success) {
        console.warn(
          `Falha ao enviar pacote ${pkg.code}, mantido como pendente.`,
        );
      }
    },

    syncPendingPackages: async () => {
      const { user } = useAuthStore.getState();
      if (!user?.uid) return;

      console.log(
        "Iniciando sincronização de pacotes pendentes...",
      );

      const result =
        await packageService.syncPendingPackages(user.uid);

      if (result.data === 0) {
        console.log(
          "Nenhum pacote pendente para sincronizar.",
        );
      } else {
        console.log(
          `${result.data} pacote(s) sincronizado(s) com sucesso.`,
        );
      }

      get().loadPackages();
    },
  }),
);
