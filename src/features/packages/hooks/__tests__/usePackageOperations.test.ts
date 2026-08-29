import { renderHook } from "@testing-library/react-native";
import { PackageStatus } from "@features/packages/domain/package.enums";
import {
  packageService,
  packageSyncService,
} from "@features/packages/package.dependencies";
import { usePackageStore } from "@features/packages/store/usePackageStore";
import { createPackage } from "@test";
import { usePackageOperations } from "../usePackageOperations";

jest.mock("@features/auth/auth.dependencies", () => ({
  authService: {
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
    observeAuthState: jest.fn(),
  },
}));

jest.mock(
  "@features/packages/package.dependencies",
  () => ({
    packageService: {
      getAllPackages: jest.fn(),
      getPendingCount: jest.fn(),
      scanPackage: jest.fn(),
      changePackageStatus: jest.fn(),
      deletePackage: jest.fn(),
      filterPackages: jest.fn(),
    },
    packageSyncService: {
      syncPackage: jest.fn(),
      syncPendingPackages: jest.fn(),
      sendMultiplePackages: jest.fn(),
      updateAndSendMultiple: jest.fn(),
    },
  }),
);

const packageServiceMock = jest.mocked(packageService);
const packageSyncServiceMock = jest.mocked(
  packageSyncService,
);

describe("usePackageOperations", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    packageServiceMock.getAllPackages.mockReturnValue([]);
    packageServiceMock.getPendingCount.mockReturnValue(0);

    usePackageStore.setState({
      packages: [],
      currentSessionPackages: [],
      pendingCount: 0,
      syncingPackageIds: [],
      isSyncingSession: false,
      isSyncingPending: false,
    });
  });

  describe("loadPackages", () => {
    it("queries service and updates packages and pendingCount in store", () => {
      const pkg = createPackage({ id: "1" });
      packageServiceMock.getAllPackages.mockReturnValue([
        pkg,
      ]);
      packageServiceMock.getPendingCount.mockReturnValue(1);

      const { result } = renderHook(() =>
        usePackageOperations(),
      );
      result.current.loadPackages("user-1");

      expect(
        packageServiceMock.getAllPackages,
      ).toHaveBeenCalledWith("user-1");
      expect(
        packageServiceMock.getPendingCount,
      ).toHaveBeenCalledWith("user-1");

      expect(usePackageStore.getState().packages).toEqual([
        pkg,
      ]);
      expect(usePackageStore.getState().pendingCount).toBe(
        1,
      );
    });
  });

  describe("scanPackage", () => {
    it("persists scan, adds to session, and refreshes store from SQLite", async () => {
      const scannedPkg = createPackage({
        id: "1",
        code: "PKG-001",
      });
      packageServiceMock.scanPackage.mockResolvedValue(
        scannedPkg,
      );
      packageServiceMock.getAllPackages.mockReturnValue([
        scannedPkg,
      ]);
      packageServiceMock.getPendingCount.mockReturnValue(1);

      const { result } = renderHook(() =>
        usePackageOperations(),
      );
      const returnedPkg = await result.current.scanPackage(
        "PKG-001",
        "user-1",
      );

      expect(returnedPkg).toEqual(scannedPkg);
      expect(
        usePackageStore.getState().currentSessionPackages,
      ).toEqual([scannedPkg]);
      expect(usePackageStore.getState().packages).toEqual([
        scannedPkg,
      ]);
      expect(usePackageStore.getState().pendingCount).toBe(
        1,
      );
    });
  });

  describe("changeStatus", () => {
    it("updates package status and refreshes store from SQLite", () => {
      const { result } = renderHook(() =>
        usePackageOperations(),
      );
      const res = result.current.changeStatus(
        "1",
        "user-1",
        PackageStatus.IN_DELIVERY,
      );

      expect(
        packageServiceMock.changePackageStatus,
      ).toHaveBeenCalledWith(
        "1",
        "user-1",
        PackageStatus.IN_DELIVERY,
        undefined,
      );
      expect(
        packageServiceMock.getAllPackages,
      ).toHaveBeenCalledWith("user-1");
      expect(res).toEqual({ success: true });
    });

    it("returns failure when persistence throws", () => {
      packageServiceMock.changePackageStatus.mockImplementation(
        () => {
          throw new Error("DB Error");
        },
      );

      const { result } = renderHook(() =>
        usePackageOperations(),
      );
      const res = result.current.changeStatus(
        "1",
        "user-1",
        PackageStatus.IN_DELIVERY,
      );

      expect(res).toEqual({ success: false });
    });
  });

  describe("deletePackage", () => {
    it("deletes package, removes from session and refreshes store", () => {
      const pkg = createPackage({ id: "1" });
      usePackageStore.setState({
        currentSessionPackages: [pkg],
      });

      const { result } = renderHook(() =>
        usePackageOperations(),
      );
      result.current.deletePackage("1", "user-1");

      expect(
        packageServiceMock.deletePackage,
      ).toHaveBeenCalledWith("1", "user-1");
      expect(
        usePackageStore.getState().currentSessionPackages,
      ).toEqual([]);
      expect(
        packageServiceMock.getAllPackages,
      ).toHaveBeenCalledWith("user-1");
    });
  });

  describe("sendPackage", () => {
    it("synchronizes package, manages syncing indicator, and reloads packages", async () => {
      const pkg = createPackage({ id: "pkg-1" });
      packageSyncServiceMock.syncPackage.mockResolvedValue({
        success: true,
      });

      const { result } = renderHook(() =>
        usePackageOperations(),
      );
      const res = await result.current.sendPackage(
        pkg,
        "user-1",
      );

      expect(
        packageSyncServiceMock.syncPackage,
      ).toHaveBeenCalledWith(pkg);
      expect(
        usePackageStore.getState().syncingPackageIds,
      ).not.toContain("pkg-1");
      expect(
        packageServiceMock.getAllPackages,
      ).toHaveBeenCalledWith("user-1");
      expect(res).toEqual({ success: true });
    });

    it("prevents double-sending when package is already syncing", async () => {
      const pkg = createPackage({ id: "pkg-1" });
      usePackageStore.setState({
        syncingPackageIds: ["pkg-1"],
      });

      const { result } = renderHook(() =>
        usePackageOperations(),
      );
      const res = await result.current.sendPackage(
        pkg,
        "user-1",
      );

      expect(res).toEqual({ success: false });
      expect(
        packageSyncServiceMock.syncPackage,
      ).not.toHaveBeenCalled();
    });
  });

  describe("syncPendingPackages", () => {
    it("synchronizes all pending packages and updates isSyncingPending flag", async () => {
      const { result } = renderHook(() =>
        usePackageOperations(),
      );
      await result.current.syncPendingPackages("user-1");

      expect(
        packageSyncServiceMock.syncPendingPackages,
      ).toHaveBeenCalledWith("user-1");
      expect(
        usePackageStore.getState().isSyncingPending,
      ).toBe(false);
      expect(
        packageServiceMock.getAllPackages,
      ).toHaveBeenCalledWith("user-1");
    });
  });

  describe("sendAllCurrentSessionPackages", () => {
    it("sends current session and resets session on success", async () => {
      const pkg = createPackage({ id: "1" });
      usePackageStore.setState({
        currentSessionPackages: [pkg],
      });

      packageSyncServiceMock.sendMultiplePackages.mockResolvedValue(
        {
          success: true,
          data: { sent: 1, failed: 0, failedPackages: [] },
        },
      );

      const { result } = renderHook(() =>
        usePackageOperations(),
      );
      await result.current.sendAllCurrentSessionPackages(
        "user-1",
      );

      expect(
        usePackageStore.getState().currentSessionPackages,
      ).toEqual([]);
      expect(
        usePackageStore.getState().isSyncingSession,
      ).toBe(false);
    });
  });

  describe("updateAndSendCurrentSessionPackages", () => {
    it("updates and sends session packages", async () => {
      const pkg = createPackage({ id: "1" });
      usePackageStore.setState({
        currentSessionPackages: [pkg],
      });

      packageSyncServiceMock.updateAndSendMultiple.mockResolvedValue(
        {
          success: true,
          data: { sent: 1, failed: 0, failedPackages: [] },
        },
      );

      const { result } = renderHook(() =>
        usePackageOperations(),
      );
      const res =
        await result.current.updateAndSendCurrentSessionPackages(
          "user-1",
          PackageStatus.IN_DELIVERY,
        );

      expect(res).toEqual({
        success: true,
        sent: 1,
        failed: 0,
      });
      expect(
        usePackageStore.getState().currentSessionPackages,
      ).toEqual([]);
    });
  });
});
