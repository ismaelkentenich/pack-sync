import { PackageSyncGateway } from "@features/packages/domain/package-sync.gateway";
import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import { PackageErrorCode } from "@features/packages/domain/package.errors";
import { PackageRepository } from "@features/packages/domain/package.repository";
import {
  createPackage,
  createPackageRepositoryMock,
  createPackageSyncGatewayMock,
} from "@test";
import { PackageSyncService } from "../PackageSyncService";

function createDeferred<T>() {
  let resolve = (_value: T) => {};

  const promise = new Promise<T>((resolver) => {
    resolve = resolver;
  });

  return {
    promise,
    resolve,
  };
}

describe("PackageSyncService", () => {
  let repository: jest.Mocked<PackageRepository>;
  let syncGateway: jest.Mocked<PackageSyncGateway>;
  let service: PackageSyncService;

  beforeEach(() => {
    repository = createPackageRepositoryMock();
    syncGateway = createPackageSyncGatewayMock();

    service = new PackageSyncService(
      repository,
      syncGateway,
    );
  });

  describe("syncPackage", () => {
    it("returns error if package id is undefined", async () => {
      const pkg = createPackage({ id: undefined });
      const result = await service.syncPackage(pkg);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(
        PackageErrorCode.INVALID_FOR_SYNC,
      );
      expect(syncGateway.send).not.toHaveBeenCalled();
    });

    it("sends the snapshot recovered from the repository", async () => {
      const stalePackage = createPackage({
        status: PackageStatus.COLLECTED,
        receiverName: undefined,
      });

      const persistedPackage = createPackage({
        status: PackageStatus.DELIVERED,
        deliveryStatus: DeliveryStatus.PENDING,
        receiverName: "João",
      });

      repository.findById.mockReturnValue(persistedPackage);

      syncGateway.send.mockResolvedValue({
        success: true,
      });

      await service.syncPackage(stalePackage);

      expect(repository.findById).toHaveBeenCalledWith(
        "1",
        "user-1",
      );

      expect(syncGateway.send).toHaveBeenCalledWith(
        persistedPackage,
      );
    });

    it("does not send a delivered package without receiverName", async () => {
      const pkg = createPackage({
        status: PackageStatus.DELIVERED,
        deliveryStatus: DeliveryStatus.PENDING,
        receiverName: undefined,
      });

      repository.findById.mockReturnValue(pkg);

      const result = await service.syncPackage(pkg);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(
        PackageErrorCode.RECEIVER_REQUIRED,
      );
      expect(syncGateway.send).not.toHaveBeenCalled();
      expect(repository.markAsSent).not.toHaveBeenCalled();
    });

    it("marks as sent only after the persisted snapshot is synchronized", async () => {
      const pkg = createPackage({
        syncVersion: 1,
      });

      repository.findById.mockReturnValue(pkg);

      syncGateway.send.mockResolvedValue({
        success: true,
      });

      const result = await service.syncPackage(pkg);

      expect(result.success).toBe(true);
      expect(syncGateway.send).toHaveBeenCalledWith(pkg);
      expect(repository.markAsSent).toHaveBeenCalledWith(
        "1",
        "user-1",
        1,
      );
    });

    it("captures syncVersion before POST and passes it to markAsSent", async () => {
      const pkg = createPackage({
        syncVersion: 3,
      });

      repository.findById.mockReturnValue(pkg);

      syncGateway.send.mockResolvedValue({
        success: true,
      });

      const result = await service.syncPackage(pkg);

      expect(result.success).toBe(true);
      expect(syncGateway.send).toHaveBeenCalledWith(pkg);
      expect(repository.markAsSent).toHaveBeenCalledWith(
        "1",
        "user-1",
        3,
      );
    });

    it("maps 401 response status to UNAUTHORIZED error", async () => {
      const pkg = createPackage();
      repository.findById.mockReturnValue(pkg);
      syncGateway.send.mockResolvedValue({
        success: false,
        status: 401,
      });

      const result = await service.syncPackage(pkg);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(
        PackageErrorCode.UNAUTHORIZED,
      );
    });

    it("maps 403 response status to FORBIDDEN error", async () => {
      const pkg = createPackage();
      repository.findById.mockReturnValue(pkg);
      syncGateway.send.mockResolvedValue({
        success: false,
        status: 403,
      });

      const result = await service.syncPackage(pkg);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(
        PackageErrorCode.FORBIDDEN,
      );
    });

    it("keeps the package pending when synchronization fails", async () => {
      const pkg = createPackage({
        deliveryStatus: DeliveryStatus.PENDING,
        sent_at: undefined,
      });

      repository.findById.mockReturnValue(pkg);

      syncGateway.send.mockResolvedValue({
        success: false,
      });

      expect(repository.markAsSent).not.toHaveBeenCalled();
      expect(pkg.deliveryStatus).toBe(
        DeliveryStatus.PENDING,
      );
      expect(pkg.sent_at).toBeUndefined();
    });

    it("keeps the package pending when synchronization throws exception", async () => {
      const pkg = createPackage({
        id: "pkg-err-1",
        code: "PKG-ERR",
        deliveryStatus: DeliveryStatus.PENDING,
      });

      repository.findById.mockReturnValue(pkg);
      syncGateway.send.mockRejectedValue(
        new Error("Network error"),
      );

      const result = await service.syncPackage(pkg);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(
        PackageErrorCode.SYNC_FAILED,
      );
      expect(repository.markAsSent).not.toHaveBeenCalled();
    });

    it("shares one sync operation for concurrent calls of the same package", async () => {
      const pkg = createPackage();

      repository.findById.mockReturnValue(pkg);

      const deferred = createDeferred<{
        success: boolean;
      }>();

      syncGateway.send.mockReturnValue(deferred.promise);

      const first = service.syncPackage(pkg);
      const second = service.syncPackage(pkg);

      expect(syncGateway.send).toHaveBeenCalledTimes(1);
      expect(repository.findById).toHaveBeenCalledTimes(1);

      deferred.resolve({
        success: true,
      });

      const [firstResult, secondResult] = await Promise.all(
        [first, second],
      );

      expect(firstResult.success).toBe(true);
      expect(secondResult.success).toBe(true);
      expect(syncGateway.send).toHaveBeenCalledTimes(1);
      expect(repository.markAsSent).toHaveBeenCalledTimes(
        1,
      );
    });

    it("releases the package lock after a successful sync", async () => {
      const pkg = createPackage();

      repository.findById.mockReturnValue(pkg);

      syncGateway.send.mockResolvedValue({
        success: true,
      });

      await service.syncPackage(pkg);
      await service.syncPackage(pkg);

      expect(syncGateway.send).toHaveBeenCalledTimes(2);
      expect(repository.markAsSent).toHaveBeenCalledTimes(
        2,
      );
    });

    it("releases the package lock after a failed sync", async () => {
      const pkg = createPackage();

      repository.findById.mockReturnValue(pkg);

      syncGateway.send
        .mockResolvedValueOnce({
          success: false,
        })
        .mockResolvedValueOnce({
          success: true,
        });

      const firstResult = await service.syncPackage(pkg);

      expect(firstResult.success).toBe(false);

      const secondResult = await service.syncPackage(pkg);

      expect(secondResult.success).toBe(true);
      expect(syncGateway.send).toHaveBeenCalledTimes(2);
    });
  });

  describe("syncPendingPackages", () => {
    it("preserves receiverName when retrying a pending delivered package", async () => {
      const pendingPackage = createPackage({
        status: PackageStatus.DELIVERED,
        deliveryStatus: DeliveryStatus.PENDING,
        receiverName: "Maria",
      });

      repository.findByDeliveryStatus.mockReturnValue([
        pendingPackage,
      ]);

      repository.findById.mockReturnValue(pendingPackage);

      syncGateway.send.mockResolvedValue({
        success: true,
      });

      await service.syncPendingPackages("user-1");

      expect(syncGateway.send).toHaveBeenCalledWith(
        expect.objectContaining({
          status: PackageStatus.DELIVERED,
          deliveryStatus: DeliveryStatus.PENDING,
          receiverName: "Maria",
        }),
      );
    });

    it("returns 0 when there are no pending packages", async () => {
      repository.findByDeliveryStatus.mockReturnValue([]);

      const result =
        await service.syncPendingPackages("user-1");

      expect(result).toEqual({
        success: true,
        data: 0,
      });
      expect(syncGateway.send).not.toHaveBeenCalled();
    });

    it("shares one pending reconciliation for concurrent calls", async () => {
      const pkg = createPackage({
        deliveryStatus: DeliveryStatus.PENDING,
      });

      repository.findByDeliveryStatus.mockReturnValue([
        pkg,
      ]);

      repository.findById.mockReturnValue(pkg);

      const deferred = createDeferred<{
        success: boolean;
      }>();

      syncGateway.send.mockReturnValue(deferred.promise);

      const first = service.syncPendingPackages("user-1");
      const second = service.syncPendingPackages("user-1");

      expect(
        repository.findByDeliveryStatus,
      ).toHaveBeenCalledTimes(1);

      expect(syncGateway.send).toHaveBeenCalledTimes(1);

      deferred.resolve({
        success: true,
      });

      const [firstResult, secondResult] = await Promise.all(
        [first, second],
      );

      expect(firstResult).toEqual({
        success: true,
        data: 1,
      });

      expect(secondResult).toEqual({
        success: true,
        data: 1,
      });

      expect(syncGateway.send).toHaveBeenCalledTimes(1);
    });

    it("releases the pending reconciliation lock after completion", async () => {
      repository.findByDeliveryStatus.mockReturnValue([]);

      await service.syncPendingPackages("user-1");
      await service.syncPendingPackages("user-1");

      expect(
        repository.findByDeliveryStatus,
      ).toHaveBeenCalledTimes(2);
    });
  });

  describe("sendMultiplePackages", () => {
    it("reports a partial batch failure without hiding successful sends", async () => {
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

      repository.findById.mockImplementation((id) => {
        if (id === "1") return first;
        if (id === "2") return second;
        if (id === "3") return third;
        return null;
      });

      syncGateway.send
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ success: false })
        .mockResolvedValueOnce({ success: true });

      const result = await service.sendMultiplePackages([
        first,
        second,
        third,
      ]);

      expect(result.success).toBe(false);
      expect(result.data).toEqual({
        sent: 2,
        failed: 1,
        failedPackages: [second],
      });
      expect(result.error?.code).toBe(
        PackageErrorCode.MULTIPLE_SYNC_FAILED,
      );
      expect(result.error?.params).toEqual({
        count: 1,
      });
      expect(repository.markAsSent).toHaveBeenCalledTimes(
        2,
      );
    });
  });

  describe("updateAndSendMultiple", () => {
    it("synchronizes batch packages using the persisted receiverName", async () => {
      const first = createPackage({
        id: "1",
        code: "PKG-001",
      });

      const second = createPackage({
        id: "2",
        code: "PKG-002",
      });

      const persistedFirst = createPackage({
        id: "1",
        code: "PKG-001",
        status: PackageStatus.DELIVERED,
        deliveryStatus: DeliveryStatus.PENDING,
        receiverName: "João",
      });

      const persistedSecond = createPackage({
        id: "2",
        code: "PKG-002",
        status: PackageStatus.DELIVERED,
        deliveryStatus: DeliveryStatus.PENDING,
        receiverName: "João",
      });

      repository.findById.mockImplementation((id) => {
        if (id === "1") return persistedFirst;
        if (id === "2") return persistedSecond;
        return null;
      });

      syncGateway.send.mockResolvedValue({
        success: true,
      });

      const result = await service.updateAndSendMultiple(
        [first, second],
        "user-1",
        PackageStatus.DELIVERED,
        "João",
      );

      expect(
        repository.batchUpdateStatus,
      ).toHaveBeenCalledWith(
        ["1", "2"],
        "user-1",
        PackageStatus.DELIVERED,
        "João",
      );

      expect(syncGateway.send).toHaveBeenNthCalledWith(
        1,
        persistedFirst,
      );
      expect(syncGateway.send).toHaveBeenNthCalledWith(
        2,
        persistedSecond,
      );

      expect(result).toEqual({
        success: true,
        data: {
          sent: 2,
          failed: 0,
          failedPackages: [],
        },
        error: undefined,
      });
    });

    it("requires a receiver for batch delivered status", async () => {
      const result = await service.updateAndSendMultiple(
        [createPackage()],
        "user-1",
        PackageStatus.DELIVERED,
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(
        PackageErrorCode.RECEIVER_REQUIRED,
      );
      expect(
        repository.batchUpdateStatus,
      ).not.toHaveBeenCalled();
      expect(syncGateway.send).not.toHaveBeenCalled();
    });

    it("does not synchronize packages when persistence fails", async () => {
      const packages = [
        createPackage({ id: "1", code: "PKG-001" }),
        createPackage({ id: "2", code: "PKG-002" }),
      ];

      repository.batchUpdateStatus.mockImplementation(
        () => {
          throw new Error("SQLite write failed");
        },
      );

      const result = await service.updateAndSendMultiple(
        packages,
        "user-1",
        PackageStatus.IN_DELIVERY,
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(
        PackageErrorCode.UNKNOWN,
      );
      expect(syncGateway.send).not.toHaveBeenCalled();
      expect(repository.markAsSent).not.toHaveBeenCalled();
    });
  });
});
