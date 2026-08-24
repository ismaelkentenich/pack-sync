import { PackageStatus } from "@features/packages/domain/package.enums";
import {
  PackageError,
  PackageErrorCode,
} from "@features/packages/domain/package.errors";
import { packageService } from "@features/packages/package.dependencies";
import { createPackage } from "@test";
import { usePackageStore } from "../usePackageStore";

jest.mock(
  "@features/packages/package.dependencies",
  () => ({
    packageService: {
      getAllPackages: jest.fn(),
      getPendingCount: jest.fn(),
      scanPackage: jest.fn(),
      changePackageStatus: jest.fn(),
      syncPackage: jest.fn(),
      syncPendingPackages: jest.fn(),
      sendMultiplePackages: jest.fn(),
      updateAndSendMultiple: jest.fn(),
      filterPackages: jest.fn(),
    },
  }),
);

const packageServiceMock = jest.mocked(packageService);

describe("usePackageStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    packageServiceMock.getAllPackages.mockReturnValue([]);
    packageServiceMock.getPendingCount.mockReturnValue(0);
    packageServiceMock.filterPackages.mockReturnValue([]);

    usePackageStore.setState({
      packages: [],
      currentSessionPackages: [],
      pendingCount: 0,

      syncingPackageIds: [],
      isSyncingSession: false,
      isSyncingPending: false,

      searchTerm: "",
      statusFilter: "",

      feedback: {
        loading: false,
      },
    });
  });

  describe("changeStatus", () => {
    it("returns success when the status mutation is persisted", () => {
      packageServiceMock.changePackageStatus.mockReturnValue(
        undefined,
      );

      const result = usePackageStore
        .getState()
        .changeStatus(
          "1",
          "user-1",
          PackageStatus.IN_DELIVERY,
        );

      expect(
        packageServiceMock.changePackageStatus,
      ).toHaveBeenCalledTimes(1);

      expect(
        packageServiceMock.changePackageStatus,
      ).toHaveBeenCalledWith(
        "1",
        "user-1",
        PackageStatus.IN_DELIVERY,
        undefined,
      );

      expect(result).toEqual({
        success: true,
      });
    });

    it("does not reload packages automatically after a successful mutation", () => {
      packageServiceMock.changePackageStatus.mockReturnValue(
        undefined,
      );

      const result = usePackageStore
        .getState()
        .changeStatus(
          "1",
          "user-1",
          PackageStatus.IN_DELIVERY,
        );

      expect(result.success).toBe(true);

      expect(
        packageServiceMock.getAllPackages,
      ).not.toHaveBeenCalled();

      expect(
        packageServiceMock.getPendingCount,
      ).not.toHaveBeenCalled();
    });

    it("returns failure when status persistence fails", () => {
      packageServiceMock.changePackageStatus.mockImplementation(
        () => {
          throw new PackageError(PackageErrorCode.UNKNOWN);
        },
      );

      const result = usePackageStore
        .getState()
        .changeStatus(
          "1",
          "user-1",
          PackageStatus.IN_DELIVERY,
        );

      expect(result).toEqual({
        success: false,
      });
    });

    it("stores feedback when status persistence fails", () => {
      packageServiceMock.changePackageStatus.mockImplementation(
        () => {
          throw new PackageError(
            PackageErrorCode.RECEIVER_REQUIRED,
          );
        },
      );

      const result = usePackageStore
        .getState()
        .changeStatus(
          "1",
          "user-1",
          PackageStatus.DELIVERED,
        );

      expect(result.success).toBe(false);

      expect(usePackageStore.getState().feedback).toEqual({
        loading: false,
        error: {
          key: "packages.errors.receiverRequired",
        },
      });
    });

    it("does not reload packages when persistence fails", () => {
      packageServiceMock.changePackageStatus.mockImplementation(
        () => {
          throw new Error("SQLite write failed");
        },
      );

      const result = usePackageStore
        .getState()
        .changeStatus(
          "1",
          "user-1",
          PackageStatus.IN_DELIVERY,
        );

      expect(result.success).toBe(false);

      expect(
        packageServiceMock.getAllPackages,
      ).not.toHaveBeenCalled();

      expect(
        packageServiceMock.getPendingCount,
      ).not.toHaveBeenCalled();
    });
  });

  describe("sendPackage", () => {
    it("returns success after a package is synchronized", async () => {
      const pkg = createPackage();

      packageServiceMock.syncPackage.mockResolvedValue({
        success: true,
      });

      const result = await usePackageStore
        .getState()
        .sendPackage(pkg, "user-1");

      expect(
        packageServiceMock.syncPackage,
      ).toHaveBeenCalledTimes(1);

      expect(
        packageServiceMock.syncPackage,
      ).toHaveBeenCalledWith(pkg);

      expect(result).toEqual({
        success: true,
      });
    });

    it("returns failure when synchronization fails", async () => {
      const pkg = createPackage();

      packageServiceMock.syncPackage.mockResolvedValue({
        success: false,
        error: new PackageError(
          PackageErrorCode.SYNC_FAILED,
          {
            code: pkg.code,
          },
        ),
      });

      const result = await usePackageStore
        .getState()
        .sendPackage(pkg, "user-1");

      expect(result).toEqual({
        success: false,
      });

      expect(usePackageStore.getState().feedback).toEqual({
        loading: false,
        error: {
          key: "packages.errors.syncFailed",
          params: {
            code: pkg.code,
          },
        },
      });
    });

    it("reloads packages only once after synchronization completes", async () => {
      const pkg = createPackage();

      packageServiceMock.syncPackage.mockResolvedValue({
        success: true,
      });

      await usePackageStore
        .getState()
        .sendPackage(pkg, "user-1");

      expect(
        packageServiceMock.getAllPackages,
      ).toHaveBeenCalledTimes(1);

      expect(
        packageServiceMock.getPendingCount,
      ).toHaveBeenCalledTimes(1);
    });

    it("releases the syncing package state after success", async () => {
      const pkg = createPackage({
        id: "10",
      });

      packageServiceMock.syncPackage.mockResolvedValue({
        success: true,
      });

      await usePackageStore
        .getState()
        .sendPackage(pkg, "user-1");

      expect(
        usePackageStore.getState().syncingPackageIds,
      ).not.toContain("10");
    });

    it("releases the syncing package state after failure", async () => {
      const pkg = createPackage({
        id: "10",
      });

      packageServiceMock.syncPackage.mockResolvedValue({
        success: false,
        error: new PackageError(
          PackageErrorCode.SYNC_FAILED,
          {
            code: pkg.code,
          },
        ),
      });

      await usePackageStore
        .getState()
        .sendPackage(pkg, "user-1");

      expect(
        usePackageStore.getState().syncingPackageIds,
      ).not.toContain(10);
    });
  });

  describe("updateAndSendCurrentSessionPackages", () => {
    it("clears the current session after a successful batch", async () => {
      const pkg = createPackage();

      usePackageStore.setState({
        currentSessionPackages: [pkg],
      });

      packageServiceMock.updateAndSendMultiple.mockResolvedValue(
        {
          success: true,
          data: {
            sent: 1,
            failed: 0,
            failedPackages: [],
          },
        },
      );

      const result = await usePackageStore
        .getState()
        .updateAndSendCurrentSessionPackages(
          "user-1",
          PackageStatus.IN_DELIVERY,
        );

      expect(result).toEqual({
        success: true,
        sent: 1,
        failed: 0,
      });

      expect(
        usePackageStore.getState().currentSessionPackages,
      ).toEqual([]);
    });

    it("keeps the current session when the batch fails", async () => {
      const pkg = createPackage();

      usePackageStore.setState({
        currentSessionPackages: [pkg],
      });

      packageServiceMock.updateAndSendMultiple.mockResolvedValue(
        {
          success: false,
          data: {
            sent: 0,
            failed: 1,
            failedPackages: [pkg],
          },
          error: new PackageError(
            PackageErrorCode.MULTIPLE_SYNC_FAILED,
            {
              count: 1,
            },
          ),
        },
      );

      const result = await usePackageStore
        .getState()
        .updateAndSendCurrentSessionPackages(
          "user-1",
          PackageStatus.IN_DELIVERY,
        );

      expect(result).toEqual({
        success: false,
        sent: 0,
        failed: 1,
      });

      expect(
        usePackageStore.getState().currentSessionPackages,
      ).toEqual([pkg]);
    });

    it("keeps the current session when the service throws", async () => {
      const pkg = createPackage();

      usePackageStore.setState({
        currentSessionPackages: [pkg],
      });

      packageServiceMock.updateAndSendMultiple.mockRejectedValue(
        new Error("Unexpected failure"),
      );

      const result = await usePackageStore
        .getState()
        .updateAndSendCurrentSessionPackages(
          "user-1",
          PackageStatus.IN_DELIVERY,
        );

      expect(result).toEqual({
        success: false,
        sent: 0,
        failed: 1,
      });

      expect(
        usePackageStore.getState().currentSessionPackages,
      ).toEqual([pkg]);
    });

    it("reloads packages once after a completed batch result", async () => {
      const pkg = createPackage();

      usePackageStore.setState({
        currentSessionPackages: [pkg],
      });

      packageServiceMock.updateAndSendMultiple.mockResolvedValue(
        {
          success: true,
          data: {
            sent: 1,
            failed: 0,
            failedPackages: [],
          },
        },
      );

      await usePackageStore
        .getState()
        .updateAndSendCurrentSessionPackages(
          "user-1",
          PackageStatus.IN_DELIVERY,
        );

      expect(
        packageServiceMock.getAllPackages,
      ).toHaveBeenCalledTimes(1);

      expect(
        packageServiceMock.getPendingCount,
      ).toHaveBeenCalledTimes(1);
    });

    it("does not reload packages again when the service throws", async () => {
      const pkg = createPackage();

      usePackageStore.setState({
        currentSessionPackages: [pkg],
      });

      packageServiceMock.updateAndSendMultiple.mockRejectedValue(
        new Error("SQLite failure"),
      );

      await usePackageStore
        .getState()
        .updateAndSendCurrentSessionPackages(
          "user-1",
          PackageStatus.IN_DELIVERY,
        );

      expect(
        packageServiceMock.getAllPackages,
      ).not.toHaveBeenCalled();

      expect(
        packageServiceMock.getPendingCount,
      ).not.toHaveBeenCalled();
    });

    it("returns failure without calling the service when the current session is empty", async () => {
      const result = await usePackageStore
        .getState()
        .updateAndSendCurrentSessionPackages(
          "user-1",
          PackageStatus.IN_DELIVERY,
        );

      expect(result).toEqual({
        success: false,
        sent: 0,
        failed: 0,
      });

      expect(
        packageServiceMock.updateAndSendMultiple,
      ).not.toHaveBeenCalled();
    });

    it("releases the session syncing state after success", async () => {
      const pkg = createPackage();

      usePackageStore.setState({
        currentSessionPackages: [pkg],
      });

      packageServiceMock.updateAndSendMultiple.mockResolvedValue(
        {
          success: true,
          data: {
            sent: 1,
            failed: 0,
            failedPackages: [],
          },
        },
      );

      await usePackageStore
        .getState()
        .updateAndSendCurrentSessionPackages(
          "user-1",
          PackageStatus.IN_DELIVERY,
        );

      expect(
        usePackageStore.getState().isSyncingSession,
      ).toBe(false);
    });

    it("releases the session syncing state after failure", async () => {
      const pkg = createPackage();

      usePackageStore.setState({
        currentSessionPackages: [pkg],
      });

      packageServiceMock.updateAndSendMultiple.mockRejectedValue(
        new Error("Unexpected failure"),
      );

      await usePackageStore
        .getState()
        .updateAndSendCurrentSessionPackages(
          "user-1",
          PackageStatus.IN_DELIVERY,
        );

      expect(
        usePackageStore.getState().isSyncingSession,
      ).toBe(false);
    });

    it("keeps only failed packages in the current session after a partial batch", async () => {
      const packages = Array.from(
        {
          length: 10,
        },
        (_, index) =>
          createPackage({
            id: index + "1",
            code: `PKG-${String(index + 1).padStart(
              3,
              "0",
            )}`,
          }),
      );

      const failedFirst = packages[3];
      const failedSecond = packages[7];

      usePackageStore.setState({
        currentSessionPackages: packages,
      });

      packageServiceMock.updateAndSendMultiple.mockResolvedValue(
        {
          success: false,
          data: {
            sent: 8,
            failed: 2,
            failedPackages: [failedFirst, failedSecond],
          },
          error: new PackageError(
            PackageErrorCode.MULTIPLE_SYNC_FAILED,
            {
              count: 2,
            },
          ),
        },
      );

      packageServiceMock.getAllPackages.mockReturnValue(
        packages,
      );

      packageServiceMock.getPendingCount.mockReturnValue(2);

      const result = await usePackageStore
        .getState()
        .updateAndSendCurrentSessionPackages(
          "user-1",
          PackageStatus.IN_DELIVERY,
        );

      expect(result).toEqual({
        success: false,
        sent: 8,
        failed: 2,
      });

      expect(
        usePackageStore.getState().currentSessionPackages,
      ).toEqual([failedFirst, failedSecond]);
    });

    it("keeps the persisted snapshots of failed packages after a partial batch", async () => {
      const first = createPackage({
        id: "1",
        code: "PKG-001",
      });

      const failed = createPackage({
        id: "2",
        code: "PKG-002",
        status: PackageStatus.COLLECTED,
      });

      const persistedFailed = createPackage({
        id: "2",
        code: "PKG-002",
        status: PackageStatus.DELIVERED,
        receiverName: "Maria",
      });

      usePackageStore.setState({
        currentSessionPackages: [first, failed],
      });

      packageServiceMock.updateAndSendMultiple.mockResolvedValue(
        {
          success: false,
          data: {
            sent: 1,
            failed: 1,
            failedPackages: [failed],
          },
          error: new PackageError(
            PackageErrorCode.MULTIPLE_SYNC_FAILED,
            {
              count: 1,
            },
          ),
        },
      );

      packageServiceMock.getAllPackages.mockReturnValue([
        first,
        persistedFailed,
      ]);

      packageServiceMock.getPendingCount.mockReturnValue(1);

      await usePackageStore
        .getState()
        .updateAndSendCurrentSessionPackages(
          "user-1",
          PackageStatus.DELIVERED,
          "Maria",
        );

      expect(
        usePackageStore.getState().currentSessionPackages,
      ).toEqual([persistedFailed]);
    });
  });

  describe("sendAllCurrentSessionPackages", () => {
    it("keeps only failed packages after a partial synchronization", async () => {
      const first = createPackage({
        id: "1",
        code: "PKG-001",
      });

      const second = createPackage({
        id: "2",
        code: "PKG-002",
      });

      const third = createPackage({
        id: "3",
        code: "PKG-003",
      });

      usePackageStore.setState({
        currentSessionPackages: [first, second, third],
      });

      packageServiceMock.sendMultiplePackages.mockResolvedValue(
        {
          success: false,
          data: {
            sent: 2,
            failed: 1,
            failedPackages: [second],
          },
          error: new PackageError(
            PackageErrorCode.MULTIPLE_SYNC_FAILED,
            {
              count: 1,
            },
          ),
        },
      );

      packageServiceMock.getAllPackages.mockReturnValue([
        first,
        second,
        third,
      ]);

      packageServiceMock.getPendingCount.mockReturnValue(1);

      await usePackageStore
        .getState()
        .sendAllCurrentSessionPackages("user-1");

      expect(
        usePackageStore.getState().currentSessionPackages,
      ).toEqual([second]);
    });
  });

  describe("clearUserState", () => {
    it("clears all user-scoped package state", () => {
      const pkg = createPackage();

      usePackageStore.setState({
        packages: [pkg],
        currentSessionPackages: [pkg],
        pendingCount: 4,

        syncingPackageIds: ["1", "2"],
        isSyncingSession: true,
        isSyncingPending: true,

        searchTerm: "PKG",
        statusFilter: PackageStatus.DELIVERED,

        feedback: {
          loading: false,
          error: {
            key: "packages.errors.receiverRequired",
          },
        },
      });

      usePackageStore.getState().clearUserState();

      const state = usePackageStore.getState();

      expect(state.packages).toEqual([]);
      expect(state.currentSessionPackages).toEqual([]);
      expect(state.pendingCount).toBe(0);

      expect(state.syncingPackageIds).toEqual([]);
      expect(state.isSyncingSession).toBe(false);
      expect(state.isSyncingPending).toBe(false);

      expect(state.searchTerm).toBe("");
      expect(state.statusFilter).toBe("");

      expect(state.feedback).toEqual({
        loading: false,
      });
    });

    it("does not delete persisted packages when clearing user state", () => {
      usePackageStore.setState({
        packages: [createPackage()],
      });

      usePackageStore.getState().clearUserState();

      expect(
        packageServiceMock.getAllPackages,
      ).not.toHaveBeenCalled();

      expect(
        packageServiceMock.getPendingCount,
      ).not.toHaveBeenCalled();
    });
  });
});
