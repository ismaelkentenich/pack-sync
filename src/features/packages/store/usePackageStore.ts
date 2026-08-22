import { create } from "zustand";
import { PackageStatus } from "@features/packages/domain/package.enums";
import { Package } from "@features/packages/domain/package.types";
import { packageService } from "@features/packages/package.dependencies";
import {
  getPackageErrorFeedback,
  PackageFeedbackMessage,
} from "@features/packages/utils/getPackageErrorFeedback";

type Feedback = {
  loading: boolean;
  success?: PackageFeedbackMessage;
  error?: PackageFeedbackMessage;
};

type BatchUpdateResult = {
  success: boolean;
  sent: number;
  failed: number;
};

type PackageState = {
  packages: Package[];
  currentSessionPackages: Package[];
  pendingCount: number;

  searchTerm: string;
  statusFilter: string;

  feedback: Feedback;

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

  sendAllCurrentSessionPackages: (
    userId: string,
  ) => Promise<void>;

  updateAndSendCurrentSessionPackages: (
    userId: string,
    status: PackageStatus,
    receiverName?: string,
  ) => Promise<BatchUpdateResult>;

  setSearchTerm: (term: string) => void;

  setStatusFilter: (status: string) => void;

  filteredPackages: () => Package[];

  setFeedback: (feedback: Feedback) => void;

  clearFeedback: () => void;
};

const initialFeedback: Feedback = {
  loading: false,
};

export const usePackageStore = create<PackageState>(
  (set, get) => ({
    packages: [],
    currentSessionPackages: [],
    pendingCount: 0,

    searchTerm: "",
    statusFilter: "",

    feedback: initialFeedback,

    setFeedback: (feedback) => {
      set({
        feedback,
      });
    },

    clearFeedback: () => {
      set({
        feedback: initialFeedback,
      });
    },

    setSearchTerm: (term) => {
      set({
        searchTerm: term,
      });
    },

    setStatusFilter: (status) => {
      set({
        statusFilter: status,
      });
    },

    loadPackages: (userId) => {
      const packages =
        packageService.getAllPackages(userId);

      const pendingCount =
        packageService.getPendingCount(userId);

      set({
        packages,
        pendingCount,
      });
    },

    scanPackage: async (code, userId) => {
      set({
        feedback: {
          loading: true,
        },
      });

      try {
        const newPackage = await packageService.scanPackage(
          code,
          userId,
        );

        set((state) => ({
          packages: [newPackage, ...state.packages],

          currentSessionPackages: [
            newPackage,
            ...state.currentSessionPackages,
          ],

          pendingCount: state.pendingCount + 1,
        }));

        get().loadPackages(userId);

        set({
          feedback: {
            loading: false,

            success: {
              key: "packages.feedback.scannedSuccessfully",

              params: {
                code,
              },
            },
          },
        });
      } catch (error) {
        set({
          feedback: {
            loading: false,

            error: getPackageErrorFeedback(error),
          },
        });
      }
    },

    changeStatus: (id, userId, status, receiverName) => {
      try {
        packageService.changePackageStatus(
          id,
          userId,
          status,
          receiverName,
        );

        get().loadPackages(userId);
      } catch (error) {
        set({
          feedback: {
            loading: false,

            error: getPackageErrorFeedback(error),
          },
        });
      }
    },

    sendPackage: async (pkg, userId, receiverName) => {
      const result = await packageService.syncPackage(
        pkg,
        receiverName,
      );

      get().loadPackages(userId);

      if (!result.success && result.error) {
        set({
          feedback: {
            loading: false,

            error: getPackageErrorFeedback(result.error),
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

              success: {
                key: "packages.feedback.allSentSuccessfully",
              },
            },
          });
        } else {
          set({
            feedback: {
              loading: false,

              error: result.error
                ? getPackageErrorFeedback(result.error)
                : {
                    key: "packages.feedback.sendSomeFailed",
                  },
            },
          });
        }

        get().resetSession();

        get().loadPackages(userId);
      } catch {
        set({
          feedback: {
            loading: false,

            error: {
              key: "packages.feedback.sendSomeFailed",
            },
          },
        });
      }
    },

    updateAndSendCurrentSessionPackages: async (
      userId,
      status,
      receiverName,
    ) => {
      const { currentSessionPackages } = get();

      if (currentSessionPackages.length === 0) {
        return {
          success: false,
          sent: 0,
          failed: 0,
        };
      }

      set({
        feedback: {
          loading: true,
        },
      });

      try {
        const result =
          await packageService.updateAndSendMultiple(
            currentSessionPackages,
            userId,
            status,
            receiverName,
          );

        get().loadPackages(userId);

        get().resetSession();

        set({
          feedback: {
            loading: false,
          },
        });

        return {
          success: result.success,
          sent: result.data?.sent ?? 0,
          failed: result.data?.failed ?? 0,
        };
      } catch {
        get().loadPackages(userId);

        get().resetSession();

        set({
          feedback: {
            loading: false,
          },
        });

        return {
          success: false,
          sent: 0,
          failed: currentSessionPackages.length,
        };
      }
    },

    syncPendingPackages: async (userId) => {
      await packageService.syncPendingPackages(userId);

      get().loadPackages(userId);
    },

    resetSession: () => {
      set({
        currentSessionPackages: [],
      });
    },

    filteredPackages: () =>
      packageService.filterPackages(
        get().packages,
        get().searchTerm,
        get().statusFilter,
      ),
  }),
);
