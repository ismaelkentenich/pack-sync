import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import {
  selectCurrentSessionPackages,
  selectFilteredPackages,
  selectIsSyncingPending,
  selectIsSyncingSession,
  selectPackageByCode,
  selectPackages,
  selectPackagesCount,
  selectPendingCount,
  selectRemoveFromSession,
  selectResetSession,
  selectSyncingPackageIds,
} from "../package.selectors";
import type { PackageState } from "../usePackageStore";
import type { Package } from "@features/packages/domain/package.types";

describe("package.selectors", () => {
  const mockPackage1: Package = {
    id: "1",
    code: "PKG-001",
    clientCode: "CLIENT-001",
    status: PackageStatus.COLLECTED,
    deliveryStatus: DeliveryStatus.PENDING,
    scanned_at: "2026-01-01T10:00:00Z",
  };

  const mockPackage2: Package = {
    id: "2",
    code: "PKG-002",
    clientCode: "CLIENT-002",
    status: PackageStatus.DELIVERED,
    deliveryStatus: DeliveryStatus.SENT,
    scanned_at: "2026-01-01T11:00:00Z",
  };

  const mockPackage3: Package = {
    id: "3",
    code: "BOX-999",
    clientCode: "CLIENT-003",
    status: PackageStatus.IN_DELIVERY,
    deliveryStatus: DeliveryStatus.PENDING,
    scanned_at: "2026-01-01T12:00:00Z",
  };

  const mockRemoveFromSession = jest.fn();
  const mockResetSession = jest.fn();

  const initialState: PackageState = {
    packages: [mockPackage1, mockPackage2, mockPackage3],
    currentSessionPackages: [mockPackage1],
    pendingCount: 2,
    syncingPackageIds: ["1"],
    isSyncingSession: true,
    isSyncingPending: false,
    setPackages: jest.fn(),
    setPendingCount: jest.fn(),
    addToSession: jest.fn(),
    removeFromSession: mockRemoveFromSession,
    setSessionPackages: jest.fn(),
    resetSession: mockResetSession,
    markPackageSyncing: jest.fn(),
    unmarkPackageSyncing: jest.fn(),
    setSyncingSession: jest.fn(),
    setSyncingPending: jest.fn(),
    clearUserState: jest.fn(),
  };

  it("selects packages array", () => {
    expect(selectPackages(initialState)).toEqual([
      mockPackage1,
      mockPackage2,
      mockPackage3,
    ]);
  });

  it("selects current session packages array", () => {
    expect(
      selectCurrentSessionPackages(initialState),
    ).toEqual([mockPackage1]);
  });

  it("selects pending count", () => {
    expect(selectPendingCount(initialState)).toBe(2);
  });

  it("selects syncing package ids array", () => {
    expect(selectSyncingPackageIds(initialState)).toEqual([
      "1",
    ]);
  });

  it("selects isSyncingSession flag", () => {
    expect(selectIsSyncingSession(initialState)).toBe(true);
  });

  it("selects isSyncingPending flag", () => {
    expect(selectIsSyncingPending(initialState)).toBe(
      false,
    );
  });

  it("selects total count of packages", () => {
    expect(selectPackagesCount(initialState)).toBe(3);
  });

  it("selects a package by code when code exists", () => {
    const selector = selectPackageByCode("PKG-002");
    expect(selector(initialState)).toEqual(mockPackage2);
  });

  it("returns undefined when package by code is not found or code is undefined", () => {
    expect(
      selectPackageByCode("NON-EXISTENT")(initialState),
    ).toBeUndefined();
    expect(
      selectPackageByCode(undefined)(initialState),
    ).toBeUndefined();
  });

  it("selects removeFromSession action", () => {
    expect(selectRemoveFromSession(initialState)).toBe(
      mockRemoveFromSession,
    );
  });

  it("selects resetSession action", () => {
    expect(selectResetSession(initialState)).toBe(
      mockResetSession,
    );
  });

  describe("selectFilteredPackages", () => {
    const packages = [
      mockPackage1,
      mockPackage2,
      mockPackage3,
    ];

    it("returns all packages when search term and status filter are empty", () => {
      const result = selectFilteredPackages(
        packages,
        "",
        "",
      );
      expect(result).toEqual(packages);
    });

    it("returns all packages when status filter is 'all'", () => {
      const result = selectFilteredPackages(
        packages,
        "",
        "all",
      );
      expect(result).toEqual(packages);
    });

    it("filters packages by code matching search term case-insensitively", () => {
      const result = selectFilteredPackages(
        packages,
        "pkg",
        "",
      );
      expect(result).toEqual([mockPackage1, mockPackage2]);
    });

    it("filters packages by status filter", () => {
      const result = selectFilteredPackages(
        packages,
        "",
        PackageStatus.DELIVERED,
      );
      expect(result).toEqual([mockPackage2]);
    });

    it("filters packages by both search term and status filter", () => {
      const result = selectFilteredPackages(
        packages,
        "001",
        PackageStatus.COLLECTED,
      );
      expect(result).toEqual([mockPackage1]);
    });

    it("returns empty array when search term does not match any package", () => {
      const result = selectFilteredPackages(
        packages,
        "NOTFOUND",
        "",
      );
      expect(result).toEqual([]);
    });

    it("trims whitespace from search term", () => {
      const result = selectFilteredPackages(
        packages,
        "  BOX-999  ",
        "",
      );
      expect(result).toEqual([mockPackage3]);
    });
  });
});
