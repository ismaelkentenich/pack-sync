import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import {
  selectCurrentSessionPackages,
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

  const mockRemoveFromSession = jest.fn();
  const mockResetSession = jest.fn();

  const initialState: PackageState = {
    packages: [mockPackage1, mockPackage2],
    currentSessionPackages: [mockPackage1],
    pendingCount: 1,
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
    ]);
  });

  it("selects current session packages array", () => {
    expect(
      selectCurrentSessionPackages(initialState),
    ).toEqual([mockPackage1]);
  });

  it("selects pending count", () => {
    expect(selectPendingCount(initialState)).toBe(1);
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
    expect(selectPackagesCount(initialState)).toBe(2);
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
});
