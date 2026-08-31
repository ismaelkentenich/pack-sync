import { createPackage } from "@test";
import { usePackageStore } from "../usePackageStore";

describe("usePackageStore", () => {
  beforeEach(() => {
    usePackageStore.setState({
      packages: [],
      currentSessionPackages: [],
      pendingCount: 0,
      syncingPackageIds: [],
      isSyncingSession: false,
      isSyncingPending: false,
    });
  });

  describe("setPackages", () => {
    it("updates packages and pendingCount when provided", () => {
      const pkg = createPackage({
        id: "1",
        code: "PKG-001",
      });

      usePackageStore.getState().setPackages([pkg], 1);

      const state = usePackageStore.getState();
      expect(state.packages).toEqual([pkg]);
      expect(state.pendingCount).toBe(1);
    });

    it("preserves previous pendingCount when pendingCount is undefined", () => {
      usePackageStore.setState({ pendingCount: 5 });

      const pkg = createPackage({
        id: "1",
        code: "PKG-001",
      });
      usePackageStore.getState().setPackages([pkg]);

      const state = usePackageStore.getState();
      expect(state.packages).toEqual([pkg]);
      expect(state.pendingCount).toBe(5);
    });
  });

  describe("setPendingCount", () => {
    it("updates pendingCount", () => {
      usePackageStore.getState().setPendingCount(3);
      expect(usePackageStore.getState().pendingCount).toBe(
        3,
      );
    });
  });

  describe("session management", () => {
    it("adds package to session queue", () => {
      const first = createPackage({
        id: "1",
        code: "PKG-001",
      });
      const second = createPackage({
        id: "2",
        code: "PKG-002",
      });

      usePackageStore.getState().addToSession(first);
      usePackageStore.getState().addToSession(second);

      expect(
        usePackageStore.getState().currentSessionPackages,
      ).toEqual([second, first]);
    });

    it("removes package from session queue by id or code", () => {
      const first = createPackage({
        id: "1",
        code: "PKG-001",
      });
      const second = createPackage({
        id: "2",
        code: "PKG-002",
      });

      usePackageStore.setState({
        currentSessionPackages: [first, second],
      });

      usePackageStore.getState().removeFromSession("1");
      expect(
        usePackageStore.getState().currentSessionPackages,
      ).toEqual([second]);

      usePackageStore
        .getState()
        .removeFromSession("PKG-002");
      expect(
        usePackageStore.getState().currentSessionPackages,
      ).toEqual([]);
    });

    it("sets session packages explicitly", () => {
      const pkgs = [createPackage({ id: "1" })];
      usePackageStore.getState().setSessionPackages(pkgs);
      expect(
        usePackageStore.getState().currentSessionPackages,
      ).toEqual(pkgs);
    });

    it("resets session queue", () => {
      usePackageStore.setState({
        currentSessionPackages: [createPackage()],
      });

      usePackageStore.getState().resetSession();
      expect(
        usePackageStore.getState().currentSessionPackages,
      ).toEqual([]);
    });
  });

  describe("sync indicators", () => {
    it("marks and unmarks package sync IDs without duplicating", () => {
      usePackageStore
        .getState()
        .markPackageSyncing("pkg-1");
      expect(
        usePackageStore.getState().syncingPackageIds,
      ).toEqual(["pkg-1"]);

      usePackageStore
        .getState()
        .markPackageSyncing("pkg-1");
      expect(
        usePackageStore.getState().syncingPackageIds,
      ).toEqual(["pkg-1"]);

      usePackageStore
        .getState()
        .markPackageSyncing("pkg-2");
      expect(
        usePackageStore.getState().syncingPackageIds,
      ).toEqual(["pkg-1", "pkg-2"]);

      usePackageStore
        .getState()
        .unmarkPackageSyncing("pkg-1");
      expect(
        usePackageStore.getState().syncingPackageIds,
      ).toEqual(["pkg-2"]);
    });

    it("sets session and pending sync flags", () => {
      usePackageStore.getState().setSyncingSession(true);
      expect(
        usePackageStore.getState().isSyncingSession,
      ).toBe(true);

      usePackageStore.getState().setSyncingPending(true);
      expect(
        usePackageStore.getState().isSyncingPending,
      ).toBe(true);
    });
  });

  describe("clearUserState", () => {
    it("resets all user-scoped state", () => {
      usePackageStore.setState({
        packages: [createPackage()],
        currentSessionPackages: [createPackage()],
        pendingCount: 4,
        syncingPackageIds: ["1", "2"],
        isSyncingSession: true,
        isSyncingPending: true,
      });

      usePackageStore.getState().clearUserState();

      expect(usePackageStore.getState()).toEqual(
        expect.objectContaining({
          packages: [],
          currentSessionPackages: [],
          pendingCount: 0,
          syncingPackageIds: [],
          isSyncingSession: false,
          isSyncingPending: false,
        }),
      );
    });
  });
});
