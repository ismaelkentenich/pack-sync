export const mockSyncPendingPackages = jest.fn();

export const mockPackageStore = (
  selector: (state: {
    syncPendingPackages: typeof mockSyncPendingPackages;
  }) => unknown,
) =>
  selector({
    syncPendingPackages: mockSyncPendingPackages,
  });

export function resetPackageStoreMock() {
  mockSyncPendingPackages.mockReset();
  mockSyncPendingPackages.mockResolvedValue(undefined);
}
