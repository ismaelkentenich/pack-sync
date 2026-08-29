import { PackageStatus } from "@features/packages/domain/package.enums";
import { packageService } from "@features/packages/package.dependencies";
import { usePackageStore } from "@features/packages/store/usePackageStore";
import { createPackage } from "@test";
import {
  changePackageStatus,
  deletePackage,
  loadPackages,
  scanPackage,
  sendSessionPackages,
  syncPackage,
  syncPendingPackages,
  updateSessionPackages,
} from "../index";

jest.mock(
  "@features/packages/package.dependencies",
  () => ({
    packageService: {
      getAllPackages: jest.fn(),
      getPendingCount: jest.fn(),
      scanPackage: jest.fn(),
      changePackageStatus: jest.fn(),
      deletePackage: jest.fn(),
      syncPackage: jest.fn(),
      syncPendingPackages: jest.fn(),
      sendMultiplePackages: jest.fn(),
      updateAndSendMultiple: jest.fn(),
      filterPackages: jest.fn(),
    },
  }),
);

const packageServiceMock = jest.mocked(packageService);

describe("Package Application Use Cases (Without React Rendering)", () => {
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

      loadPackages("user-1");

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

      const returnedPkg = await scanPackage(
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

  describe("syncPackage", () => {
    it("synchronizes package, manages syncing indicator, and reloads packages", async () => {
      const pkg = createPackage({ id: "pkg-1" });
      packageServiceMock.syncPackage.mockResolvedValue({
        success: true,
      });

      const res = await syncPackage(pkg, "user-1");

      expect(
        packageServiceMock.syncPackage,
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

      const res = await syncPackage(pkg, "user-1");

      expect(res).toEqual({ success: false });
      expect(
        packageServiceMock.syncPackage,
      ).not.toHaveBeenCalled();
    });
  });

  describe("syncPendingPackages", () => {
    it("synchronizes all pending packages and updates isSyncingPending flag", async () => {
      await syncPendingPackages("user-1");

      expect(
        packageServiceMock.syncPendingPackages,
      ).toHaveBeenCalledWith("user-1");
      expect(
        usePackageStore.getState().isSyncingPending,
      ).toBe(false);
      expect(
        packageServiceMock.getAllPackages,
      ).toHaveBeenCalledWith("user-1");
    });

    it("skips sync if already syncing pending packages", async () => {
      usePackageStore.setState({ isSyncingPending: true });

      await syncPendingPackages("user-1");

      expect(
        packageServiceMock.syncPendingPackages,
      ).not.toHaveBeenCalled();
    });
  });

  describe("sendSessionPackages", () => {
    it("sends current session and resets session on success", async () => {
      const pkg = createPackage({ id: "1" });
      usePackageStore.setState({
        currentSessionPackages: [pkg],
      });

      packageServiceMock.sendMultiplePackages.mockResolvedValue(
        {
          success: true,
          data: { sent: 1, failed: 0, failedPackages: [] },
        },
      );

      await sendSessionPackages("user-1");

      expect(
        usePackageStore.getState().currentSessionPackages,
      ).toEqual([]);
      expect(
        usePackageStore.getState().isSyncingSession,
      ).toBe(false);
    });

    it("does nothing when session is empty", async () => {
      usePackageStore.setState({
        currentSessionPackages: [],
      });

      await sendSessionPackages("user-1");

      expect(
        packageServiceMock.sendMultiplePackages,
      ).not.toHaveBeenCalled();
    });
  });

  describe("updateSessionPackages", () => {
    it("updates and sends session packages", async () => {
      const pkg = createPackage({ id: "1" });
      usePackageStore.setState({
        currentSessionPackages: [pkg],
      });

      packageServiceMock.updateAndSendMultiple.mockResolvedValue(
        {
          success: true,
          data: { sent: 1, failed: 0, failedPackages: [] },
        },
      );

      const res = await updateSessionPackages(
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

    it("returns error result when session is empty", async () => {
      usePackageStore.setState({
        currentSessionPackages: [],
      });

      const res = await updateSessionPackages(
        "user-1",
        PackageStatus.IN_DELIVERY,
      );

      expect(res).toEqual({
        success: false,
        sent: 0,
        failed: 0,
      });
      expect(
        packageServiceMock.updateAndSendMultiple,
      ).not.toHaveBeenCalled();
    });
  });

  describe("changePackageStatus", () => {
    it("updates package status and refreshes store from SQLite", () => {
      const res = changePackageStatus(
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

      const res = changePackageStatus(
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

      deletePackage("1", "user-1");

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
});
