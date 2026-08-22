import { PackageStatus } from "@features/packages/domain/package.enums";
import { Package } from "@features/packages/domain/package.types";
import { packageService } from "@features/packages/package.dependencies";
import {
  FeedbackMessage,
  getPackageErrorFeedback,
} from "@features/packages/utils/getPackageErrorFeedback";
import { create } from "zustand";

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

  sendAllCurrentSessionPackages: (
    userId: string,
  ) => Promise<void>;

  searchTerm: string;
  statusFilter: string;

  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;

  filteredPackages: () => Package[];

  feedback: Feedback;

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

    resetSession: () => {
      set({
        currentSessionPackages: [],
      });
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

    syncPendingPackages: async (userId) => {
      await packageService.syncPendingPackages(userId);

      get().loadPackages(userId);
    },
  }),
);
