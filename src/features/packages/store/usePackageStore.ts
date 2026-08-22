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

type MutationResult = {
  success: boolean;
};

type PackageState = {
  packages: Package[];
  currentSessionPackages: Package[];
  pendingCount: number;

  syncingPackageIds: number[];
  isSyncingSession: boolean;
  isSyncingPending: boolean;

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
  ) => MutationResult;

  resetSession: () => void;

  sendPackage: (
    pkg: Package,
    userId: string,
  ) => Promise<MutationResult>;

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

  clearUserState: () => void;
};

const initialFeedback: Feedback = {
  loading: false,
};

export const usePackageStore = create<PackageState>(
  (set, get) => ({
    packages: [],
    currentSessionPackages: [],
    pendingCount: 0,

    syncingPackageIds: [],
    isSyncingSession: false,
    isSyncingPending: false,

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

        return {
          success: true,
        };
      } catch (error) {
        set({
          feedback: {
            loading: false,
            error: getPackageErrorFeedback(error),
          },
        });

        return {
          success: false,
        };
      }
    },

    sendPackage: async (pkg, userId) => {
      const packageId = pkg.id;

      if (
        packageId !== undefined &&
        get().syncingPackageIds.includes(packageId)
      ) {
        return {
          success: false,
        };
      }

      if (packageId !== undefined) {
        set((state) => ({
          syncingPackageIds: [
            ...state.syncingPackageIds,
            packageId,
          ],
        }));
      }

      try {
        const result =
          await packageService.syncPackage(pkg);

        if (!result.success) {
          if (result.error) {
            set({
              feedback: {
                loading: false,
                error: getPackageErrorFeedback(
                  result.error,
                ),
              },
            });
          }

          return {
            success: false,
          };
        }

        return {
          success: true,
        };
      } finally {
        if (packageId !== undefined) {
          set((state) => ({
            syncingPackageIds:
              state.syncingPackageIds.filter(
                (id) => id !== packageId,
              ),
          }));
        }

        get().loadPackages(userId);
      }
    },

    sendAllCurrentSessionPackages: async (userId) => {
      const { currentSessionPackages, isSyncingSession } =
        get();

      if (
        currentSessionPackages.length === 0 ||
        isSyncingSession
      ) {
        return;
      }

      set({
        isSyncingSession: true,
        feedback: {
          loading: true,
        },
      });

      try {
        const result =
          await packageService.sendMultiplePackages(
            currentSessionPackages,
          );

        get().loadPackages(userId);

        if (result.success) {
          get().resetSession();

          set({
            feedback: {
              loading: false,
              success: {
                key: "packages.feedback.allSentSuccessfully",
              },
            },
          });

          return;
        }

        const failedPackages =
          result.data?.failedPackages ?? [];

        const failedPackageIds = new Set(
          failedPackages.flatMap((pkg) =>
            pkg.id !== undefined ? [pkg.id] : [],
          ),
        );

        const persistedFailedPackages =
          get().packages.filter(
            (pkg) =>
              pkg.id !== undefined &&
              failedPackageIds.has(pkg.id),
          );

        set({
          currentSessionPackages:
            persistedFailedPackages.length > 0
              ? persistedFailedPackages
              : failedPackages,

          feedback: {
            loading: false,
            error: result.error
              ? getPackageErrorFeedback(result.error)
              : {
                  key: "packages.feedback.sendSomeFailed",
                },
          },
        });
      } catch {
        set({
          feedback: {
            loading: false,
            error: {
              key: "packages.feedback.sendSomeFailed",
            },
          },
        });
      } finally {
        set({
          isSyncingSession: false,
        });
      }
    },

    updateAndSendCurrentSessionPackages: async (
      userId,
      status,
      receiverName,
    ) => {
      const { currentSessionPackages, isSyncingSession } =
        get();

      if (
        currentSessionPackages.length === 0 ||
        isSyncingSession
      ) {
        return {
          success: false,
          sent: 0,
          failed: 0,
        };
      }

      set({
        isSyncingSession: true,
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

        if (result.success) {
          get().resetSession();
        } else if (result.data) {
          const failedPackageIds = new Set(
            result.data.failedPackages.flatMap((pkg) =>
              pkg.id !== undefined ? [pkg.id] : [],
            ),
          );

          const persistedFailedPackages =
            get().packages.filter(
              (pkg) =>
                pkg.id !== undefined &&
                failedPackageIds.has(pkg.id),
            );

          set({
            currentSessionPackages:
              persistedFailedPackages.length > 0
                ? persistedFailedPackages
                : result.data.failedPackages,
          });
        }

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
      } finally {
        set({
          isSyncingSession: false,
        });
      }
    },

    syncPendingPackages: async (userId) => {
      if (get().isSyncingPending) {
        return;
      }

      set({
        isSyncingPending: true,
      });

      try {
        await packageService.syncPendingPackages(userId);
      } finally {
        set({
          isSyncingPending: false,
        });

        get().loadPackages(userId);
      }
    },

    resetSession: () => {
      set({
        currentSessionPackages: [],
      });
    },

    clearUserState: () => {
      set({
        packages: [],
        currentSessionPackages: [],
        pendingCount: 0,

        syncingPackageIds: [],
        isSyncingSession: false,
        isSyncingPending: false,

        searchTerm: "",
        statusFilter: "",

        feedback: initialFeedback,
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
