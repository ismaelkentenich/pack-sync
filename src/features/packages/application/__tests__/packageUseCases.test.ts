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

  describe("Stale Session Protection (TASK-001)", () => {
    let sessionGen = 1;
    const sessionTracker = {
      getSessionGeneration: () => sessionGen,
    };

    beforeEach(() => {
      sessionGen = 1;
    });

    describe("scanPackage", () => {
      it("ignores scan result and does not call addToSession or setPackages if session changes", async () => {
        const scannedPkg = createPackage({
          id: "1",
          code: "PKG-001",
        });
        let resolveScan: (
          pkg: typeof scannedPkg,
        ) => void = () => {};
        packageServiceMock.scanPackage.mockImplementation(
          () =>
            new Promise((resolve) => {
              resolveScan = resolve;
            }),
        );

        const promise = scanPackage("PKG-001", "user-A", {
          packageService: packageServiceMock,
          sessionTracker,
        });

        // Session changes (e.g. User B logs in or logout occurs)
        sessionGen = 2;

        resolveScan(scannedPkg);
        const result = await promise;

        expect(result).toEqual(scannedPkg);
        expect(
          usePackageStore.getState().currentSessionPackages,
        ).toEqual([]);
        expect(
          packageServiceMock.getAllPackages,
        ).not.toHaveBeenCalled();
        expect(usePackageStore.getState().packages).toEqual(
          [],
        );
      });
    });

    describe("syncPackage", () => {
      it("does not call loadPackages or setPackages if session changes during sync", async () => {
        const pkg = createPackage({ id: "pkg-1" });
        let resolveSync: (res: {
          success: boolean;
        }) => void = () => {};
        packageServiceMock.syncPackage.mockImplementation(
          () =>
            new Promise((resolve) => {
              resolveSync = resolve;
            }),
        );

        const promise = syncPackage(pkg, "user-A", {
          packageService: packageServiceMock,
          sessionTracker,
        });

        // User A logs out and logs back in (same userId, new session generation)
        sessionGen = 3;

        resolveSync({ success: true });
        await promise;

        expect(
          packageServiceMock.getAllPackages,
        ).not.toHaveBeenCalled();
        expect(usePackageStore.getState().packages).toEqual(
          [],
        );
      });
    });

    describe("syncPendingPackages", () => {
      it("does not update global packages when pending sync finishes after session change", async () => {
        let resolvePendingSync: (
          res: Awaited<
            ReturnType<
              typeof packageServiceMock.syncPendingPackages
            >
          >,
        ) => void = () => {};
        packageServiceMock.syncPendingPackages.mockImplementation(
          () =>
            new Promise((resolve) => {
              resolvePendingSync = resolve;
            }),
        );

        const promise = syncPendingPackages("user-A", {
          packageService: packageServiceMock,
          sessionTracker,
        });

        // User B logs in
        sessionGen = 2;

        resolvePendingSync({ success: true, data: 0 });
        await promise;

        expect(
          usePackageStore.getState().isSyncingPending,
        ).toBe(false);
        expect(
          packageServiceMock.getAllPackages,
        ).not.toHaveBeenCalled();
        expect(usePackageStore.getState().packages).toEqual(
          [],
        );
      });
    });

    describe("sendSessionPackages", () => {
      it("does not reset session or call setPackages when session changes", async () => {
        const pkg = createPackage({ id: "1" });
        usePackageStore.setState({
          currentSessionPackages: [pkg],
        });

        let resolveSend: (
          res: Awaited<
            ReturnType<
              typeof packageServiceMock.sendMultiplePackages
            >
          >,
        ) => void = () => {};
        packageServiceMock.sendMultiplePackages.mockImplementation(
          () =>
            new Promise((resolve) => {
              resolveSend = resolve;
            }),
        );

        const promise = sendSessionPackages("user-A", {
          packageService: packageServiceMock,
          sessionTracker,
        });

        // Session invalidated
        sessionGen = 2;

        resolveSend({
          success: true,
          data: { sent: 1, failed: 0, failedPackages: [] },
        });
        await promise;

        // Session was not reset because the call was stale for this session
        expect(
          usePackageStore.getState().currentSessionPackages,
        ).toEqual([pkg]);
        expect(
          packageServiceMock.getAllPackages,
        ).not.toHaveBeenCalled();
      });
    });

    describe("updateSessionPackages", () => {
      it("does not mutate store feedback when session changes", async () => {
        const pkg = createPackage({ id: "1" });
        usePackageStore.setState({
          currentSessionPackages: [pkg],
        });

        let resolveUpdate: (
          res: Awaited<
            ReturnType<
              typeof packageServiceMock.updateAndSendMultiple
            >
          >,
        ) => void = () => {};
        packageServiceMock.updateAndSendMultiple.mockImplementation(
          () =>
            new Promise((resolve) => {
              resolveUpdate = resolve;
            }),
        );

        const promise = updateSessionPackages(
          "user-A",
          PackageStatus.IN_DELIVERY,
          undefined,
          {
            packageService: packageServiceMock,
            sessionTracker,
          },
        );

        // Session invalidated
        sessionGen = 2;

        resolveUpdate({
          success: true,
          data: { sent: 1, failed: 0, failedPackages: [] },
        });
        const res = await promise;

        expect(res).toEqual({
          success: true,
          sent: 1,
          failed: 0,
        });
        expect(
          usePackageStore.getState().currentSessionPackages,
        ).toEqual([pkg]);
        expect(
          packageServiceMock.getAllPackages,
        ).not.toHaveBeenCalled();
      });
    });
  });
});
