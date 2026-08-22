import { PackageStatus } from "@features/packages/domain/package.enums";
import { PackageError } from "@features/packages/domain/package.errors";
import { Package } from "@features/packages/domain/package.types";
import { packageService } from "@features/packages/package.dependencies";
import { create } from "zustand";

type FeedbackMessage = {
  key: string;
  params?: Record<string, string | number | undefined>;
};

type Feedback = {
  loading: boolean;
  success?: FeedbackMessage;
  error?: FeedbackMessage;
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

function getPackageErrorFeedback(
  error: unknown,
): FeedbackMessage {
  if (!(error instanceof PackageError)) {
    return {
      key: "packages.errors.unknown",
    };
  }

  switch (error.code) {
    case "ALREADY_SCANNED":
      return {
        key: "packages.feedback.alreadyScanned",
      };

    case "RECEIVER_REQUIRED":
      return {
        key: "packages.errors.receiverRequired",
      };

    case "INVALID_FOR_SYNC":
      return {
        key: "packages.errors.invalidForSync",
      };

    case "SYNC_FAILED":
      return {
        key: "packages.errors.syncFailed",
        params: error.params,
      };

    case "MULTIPLE_SYNC_FAILED":
      return {
        key: "packages.errors.multipleSyncFailed",
        params: error.params,
      };

    default:
      return {
        key: "packages.errors.unknown",
      };
  }
}

export const usePackageStore = create<PackageState>(
  (set, get) => ({
    packages: [],
    currentSessionPackages: [],
    pendingCount: 0,

    searchTerm: "",
    statusFilter: "",

    feedback: {
      loading: false,
    },

    setFeedback: (feedback) => set({ feedback }),

    setSearchTerm: (term) =>
      set({
        searchTerm: term,
      }),

    setStatusFilter: (status) =>
      set({
        statusFilter: status,
      }),

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

    filteredPackages: () =>
      packageService.filterPackages(
        get().packages,
        get().searchTerm,
        get().statusFilter,
      ),

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

    resetSession: () =>
      set({
        currentSessionPackages: [],
      }),

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

    syncPendingPackages: async (userId) => {
      await packageService.syncPendingPackages(userId);

      get().loadPackages(userId);
    },
  }),
);
