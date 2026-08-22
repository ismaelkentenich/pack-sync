import { PackageStatus } from "@features/packages/domain/package.enums";
import { Package } from "@features/packages/domain/package.types";
import { create } from "zustand";
import { packageService } from "@features/packages/package.dependencies";

type Feedback = {
  loading: boolean;
  success?: string;
  error?: string;
};

type PackageState = {
  packages: Package[];
  currentSessionPackages: Package[];
  pendingCount: number;
  loadPackages: (userId: string) => void;
  scanPackage: (
    code: string,
    userId: string,
  ) => Promise<void>;
  changeStatus: (
    id: number,
    userId: string,
    status: PackageStatus,
    receiverName?: string,
  ) => void;
  resetSession: () => void;
  sendPackage: (
    pkg: Package,
    userId: string,
    receiverName?: string,
  ) => Promise<void>;
  syncPendingPackages: (userId: string) => Promise<void>;
  searchTerm: string;
  statusFilter: string;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  filteredPackages: () => Package[];
  feedback: Feedback;
  setFeedback: (feedback: Feedback) => void;
  sendAllCurrentSessionPackages: (
    userId: string,
  ) => Promise<void>;
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

    loadPackages: (userId) => {
      const pkgs = packageService.getAllPackages(userId);

      const pending =
        packageService.getPendingCount(userId);

      set({
        packages: pkgs,
        pendingCount: pending,
      });
    },

    scanPackage: async (code, userId) => {
      set({
        feedback: {
          loading: true,
        },
      });

      try {
        const newPkg = await packageService.scanPackage(
          code,
          userId,
        );

        set((state) => ({
          packages: [newPkg, ...state.packages],

          currentSessionPackages: [
            newPkg,
            ...state.currentSessionPackages,
          ],

          pendingCount: state.pendingCount + 1,
        }));

        get().loadPackages(userId);

        set({
          feedback: {
            loading: false,
            success: `Pacote ${code} escaneado com sucesso!`,
          },
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Erro ao escanear pacote";

        console.warn(message);

        set({
          feedback: {
            loading: false,
            error: message,
          },
        });
      }
    },

    sendAllCurrentSessionPackages: async (userId) => {
      const { currentSessionPackages } = get();

      if (currentSessionPackages.length === 0) {
        return;
      }

      set({
        feedback: {
          loading: true,
        },
      });

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

        get().loadPackages(userId);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
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

    changeStatus: (
      id,
      userId,
      status,
      receiverName?: string,
    ) => {
      try {
        packageService.changePackageStatus(
          id,
          userId,
          status,
          receiverName,
        );

        get().loadPackages(userId);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Erro ao atualizar status";

        console.warn(message);

        set({
          feedback: {
            loading: false,
            error: message,
          },
        });
      }
    },

    resetSession: () => set({ currentSessionPackages: [] }),

    sendPackage: async (
      pkg,
      userId,
      receiverName?: string,
    ) => {
      const result = await packageService.syncPackage(
        pkg,
        receiverName,
      );

      get().loadPackages(userId);

      if (!result.success) {
        console.warn(
          `Falha ao sincronizar pacote ${pkg.code}, mantido como pendente.`,
        );
      }
    },

    syncPendingPackages: async (userId) => {
      console.log(
        "Iniciando sincronização de pacotes pendentes...",
      );

      const result =
        await packageService.syncPendingPackages(userId);

      if (result.data === 0) {
        console.log(
          "Nenhum pacote pendente para sincronizar.",
        );
      } else {
        console.log(
          `${result.data} pacote(s) sincronizado(s) com sucesso.`,
        );
      }

      get().loadPackages(userId);
    },
  }),
);
