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
          1,
          "user-1",
          PackageStatus.EM_ROTA_DE_ENTREGA,
        );

      expect(
        packageServiceMock.changePackageStatus,
      ).toHaveBeenCalledTimes(1);

      expect(
        packageServiceMock.changePackageStatus,
      ).toHaveBeenCalledWith(
        1,
        "user-1",
        PackageStatus.EM_ROTA_DE_ENTREGA,
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
          1,
          "user-1",
          PackageStatus.EM_ROTA_DE_ENTREGA,
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
          1,
          "user-1",
          PackageStatus.EM_ROTA_DE_ENTREGA,
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
        .changeStatus(1, "user-1", PackageStatus.ENTREGUE);

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
          1,
          "user-1",
          PackageStatus.EM_ROTA_DE_ENTREGA,
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
        id: 10,
      });

      packageServiceMock.syncPackage.mockResolvedValue({
        success: true,
      });

      await usePackageStore
        .getState()
        .sendPackage(pkg, "user-1");

      expect(
        usePackageStore.getState().syncingPackageIds,
      ).not.toContain(10);
    });

    it("releases the syncing package state after failure", async () => {
      const pkg = createPackage({
        id: 10,
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
          },
        },
      );

      const result = await usePackageStore
        .getState()
        .updateAndSendCurrentSessionPackages(
          "user-1",
          PackageStatus.EM_ROTA_DE_ENTREGA,
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
          PackageStatus.EM_ROTA_DE_ENTREGA,
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
          PackageStatus.EM_ROTA_DE_ENTREGA,
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
          },
        },
      );

      await usePackageStore
        .getState()
        .updateAndSendCurrentSessionPackages(
          "user-1",
          PackageStatus.EM_ROTA_DE_ENTREGA,
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
          PackageStatus.EM_ROTA_DE_ENTREGA,
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
          PackageStatus.EM_ROTA_DE_ENTREGA,
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
          },
        },
      );

      await usePackageStore
        .getState()
        .updateAndSendCurrentSessionPackages(
          "user-1",
          PackageStatus.EM_ROTA_DE_ENTREGA,
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
          PackageStatus.EM_ROTA_DE_ENTREGA,
        );

      expect(
        usePackageStore.getState().isSyncingSession,
      ).toBe(false);
    });
  });
});
