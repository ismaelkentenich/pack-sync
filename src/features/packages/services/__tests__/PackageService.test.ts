import { PackageSyncGateway } from "@features/packages/domain/package-sync.gateway";
import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import {
  PackageError,
  PackageErrorCode,
} from "@features/packages/domain/package.errors";
import { PackageRepository } from "@features/packages/domain/package.repository";
import {
  createPackage,
  createPackageRepositoryMock,
  createPackageSyncGatewayMock,
} from "@test";
import { PackageService } from "../PackageService";

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

describe("PackageService", () => {
  let repository: jest.Mocked<PackageRepository>;
  let syncGateway: jest.Mocked<PackageSyncGateway>;
  let service: PackageService;

  beforeEach(() => {
    repository = createPackageRepositoryMock();
    syncGateway = createPackageSyncGatewayMock();

    service = new PackageService(repository, syncGateway);
  });

  describe("scanPackage", () => {
    it("allows different users to scan the same package code", async () => {
      const existingForUserOne = createPackage({
        id: 1,
        code: "PKG-SHARED",
        clientCode: "user-1",
      });

      repository.findByCode.mockImplementation(
        (code, userId) => {
          if (
            code === "PKG-SHARED" &&
            userId === "user-1"
          ) {
            return existingForUserOne;
          }

          return null;
        },
      );

      repository.create.mockImplementation((pkg) => ({
        ...pkg,
        id: 2,
      }));

      const result = await service.scanPackage(
        "PKG-SHARED",
        "user-2",
      );

      expect(repository.findByCode).toHaveBeenCalledWith(
        "PKG-SHARED",
        "user-2",
      );

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          code: "PKG-SHARED",
          clientCode: "user-2",
          status: PackageStatus.COLETADO,
          deliveryStatus: DeliveryStatus.PENDING,
        }),
      );

      expect(result).toEqual(
        expect.objectContaining({
          id: 2,
          code: "PKG-SHARED",
          clientCode: "user-2",
        }),
      );
    });

    it("rejects a duplicate scan for the same user", async () => {
      repository.findByCode.mockReturnValue(
        createPackage({
          code: "PKG-001",
          clientCode: "user-1",
        }),
      );

      await expect(
        service.scanPackage("PKG-001", "user-1"),
      ).rejects.toMatchObject({
        code: PackageErrorCode.ALREADY_SCANNED,
      });

      expect(repository.create).not.toHaveBeenCalled();
    });

    it("creates a new scanned package as pending", async () => {
      repository.findByCode.mockReturnValue(null);

      repository.create.mockImplementation((pkg) => ({
        ...pkg,
        id: 1,
      }));

      const result = await service.scanPackage(
        "PKG-001",
        "user-1",
      );

      expect(result).toEqual(
        expect.objectContaining({
          id: 1,
          code: "PKG-001",
          clientCode: "user-1",
          status: PackageStatus.COLETADO,
          deliveryStatus: DeliveryStatus.PENDING,
        }),
      );
    });
  });

  describe("changePackageStatus", () => {
    it("delegates the status update to the repository", () => {
      service.changePackageStatus(
        1,
        "user-1",
        PackageStatus.EM_ROTA_DE_ENTREGA,
      );

      expect(repository.updateStatus).toHaveBeenCalledTimes(
        1,
      );

      expect(repository.updateStatus).toHaveBeenCalledWith(
        1,
        "user-1",
        PackageStatus.EM_ROTA_DE_ENTREGA,
        undefined,
      );
    });

    it("requires a receiver when status is delivered", () => {
      expect(() =>
        service.changePackageStatus(
          1,
          "user-1",
          PackageStatus.ENTREGUE,
        ),
      ).toThrow(
        new PackageError(
          PackageErrorCode.RECEIVER_REQUIRED,
        ),
      );

      expect(
        repository.updateStatus,
      ).not.toHaveBeenCalled();
    });

    it("rejects delivered status when receiver contains only whitespace", () => {
      expect(() =>
        service.changePackageStatus(
          1,
          "user-1",
          PackageStatus.ENTREGUE,
          "   ",
        ),
      ).toThrow(
        new PackageError(
          PackageErrorCode.RECEIVER_REQUIRED,
        ),
      );

      expect(
        repository.updateStatus,
      ).not.toHaveBeenCalled();
    });
  });

  describe("syncPackage", () => {
    it("sends the snapshot recovered from the repository", async () => {
      const stalePackage = createPackage({
        status: PackageStatus.COLETADO,
        receiverName: undefined,
      });

      const persistedPackage = createPackage({
        status: PackageStatus.ENTREGUE,
        deliveryStatus: DeliveryStatus.PENDING,
        receiverName: "João",
      });

      repository.findById.mockReturnValue(persistedPackage);

      syncGateway.send.mockResolvedValue({
        success: true,
      });

      await service.syncPackage(stalePackage);

      expect(repository.findById).toHaveBeenCalledWith(
        1,
        "user-1",
      );

      expect(syncGateway.send).toHaveBeenCalledWith(
        persistedPackage,
      );
    });

    it("preserves receiverName when retrying a pending delivered package", async () => {
      const pendingPackage = createPackage({
        status: PackageStatus.ENTREGUE,
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
          status: PackageStatus.ENTREGUE,
          deliveryStatus: DeliveryStatus.PENDING,
          receiverName: "Maria",
        }),
      );
    });

    it("does not send a delivered package without receiverName", async () => {
      const pkg = createPackage({
        status: PackageStatus.ENTREGUE,
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
      const pkg = createPackage();

      repository.findById.mockReturnValue(pkg);

      syncGateway.send.mockResolvedValue({
        success: true,
      });

      const result = await service.syncPackage(pkg);

      expect(result.success).toBe(true);

      expect(syncGateway.send).toHaveBeenCalledWith(pkg);

      expect(repository.markAsSent).toHaveBeenCalledWith(
        1,
        "user-1",
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

      const result = await service.syncPackage(pkg);

      expect(result.success).toBe(false);

      expect(result.error?.code).toBe(
        PackageErrorCode.SYNC_FAILED,
      );

      expect(repository.markAsSent).not.toHaveBeenCalled();

      expect(pkg.deliveryStatus).toBe(
        DeliveryStatus.PENDING,
      );

      expect(pkg.sent_at).toBeUndefined();
    });

    it("synchronizes batch packages using the persisted receiverName", async () => {
      const first = createPackage({
        id: 1,
        code: "PKG-001",
      });

      const second = createPackage({
        id: 2,
        code: "PKG-002",
      });

      const persistedFirst = createPackage({
        id: 1,
        code: "PKG-001",
        status: PackageStatus.ENTREGUE,
        deliveryStatus: DeliveryStatus.PENDING,
        receiverName: "João",
      });

      const persistedSecond = createPackage({
        id: 2,
        code: "PKG-002",
        status: PackageStatus.ENTREGUE,
        deliveryStatus: DeliveryStatus.PENDING,
        receiverName: "João",
      });

      repository.findById.mockImplementation((id) => {
        if (id === 1) {
          return persistedFirst;
        }

        if (id === 2) {
          return persistedSecond;
        }

        return null;
      });

      syncGateway.send.mockResolvedValue({
        success: true,
      });

      const result = await service.updateAndSendMultiple(
        [first, second],
        "user-1",
        PackageStatus.ENTREGUE,
        "João",
      );

      expect(
        repository.batchUpdateStatus,
      ).toHaveBeenCalledWith(
        [1, 2],
        "user-1",
        PackageStatus.ENTREGUE,
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
        id: 1,
        code: "PKG-001",
      });

      const second = createPackage({
        id: 2,
        code: "PKG-002",
      });

      const third = createPackage({
        id: 3,
        code: "PKG-003",
      });

      repository.findById.mockImplementation((id) => {
        if (id === 1) {
          return first;
        }

        if (id === 2) {
          return second;
        }

        if (id === 3) {
          return third;
        }

        return null;
      });

      syncGateway.send
        .mockResolvedValueOnce({
          success: true,
        })
        .mockResolvedValueOnce({
          success: false,
        })
        .mockResolvedValueOnce({
          success: true,
        });

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

      expect(repository.markAsSent).toHaveBeenCalledWith(
        1,
        "user-1",
      );

      expect(repository.markAsSent).toHaveBeenCalledWith(
        3,
        "user-1",
      );

      expect(
        repository.markAsSent,
      ).not.toHaveBeenCalledWith(2, "user-1");
    });
  });

  describe("updateAndSendMultiple", () => {
    it("updates the packages before synchronizing them", async () => {
      const packages = [
        createPackage({
          id: 1,
          code: "PKG-001",
          deliveryStatus: DeliveryStatus.SENT,
          sent_at: "2026-08-22T10:00:00.000Z",
        }),
        createPackage({
          id: 2,
          code: "PKG-002",
          deliveryStatus: DeliveryStatus.SENT,
          sent_at: "2026-08-22T10:10:00.000Z",
        }),
      ];

      const updatedFirst = createPackage({
        id: 1,
        code: "PKG-001",
        status: PackageStatus.ENTREGUE,
        deliveryStatus: DeliveryStatus.PENDING,
        sent_at: undefined,
        receiverName: "João",
      });

      const updatedSecond = createPackage({
        id: 2,
        code: "PKG-002",
        status: PackageStatus.ENTREGUE,
        deliveryStatus: DeliveryStatus.PENDING,
        sent_at: undefined,
        receiverName: "João",
      });

      repository.findById.mockImplementation((id) => {
        if (id === 1) {
          return updatedFirst;
        }

        if (id === 2) {
          return updatedSecond;
        }

        return null;
      });

      syncGateway.send.mockResolvedValue({
        success: true,
      });

      const result = await service.updateAndSendMultiple(
        packages,
        "user-1",
        PackageStatus.ENTREGUE,
        "João",
      );

      expect(
        repository.batchUpdateStatus,
      ).toHaveBeenCalledTimes(1);

      expect(
        repository.batchUpdateStatus,
      ).toHaveBeenCalledWith(
        [1, 2],
        "user-1",
        PackageStatus.ENTREGUE,
        "João",
      );

      expect(result.success).toBe(true);

      expect(result.data).toEqual({
        sent: 2,
        failed: 0,
        failedPackages: [],
      });
    });

    it("does not preserve sent metadata from the previous package version", async () => {
      const pkg = createPackage({
        id: 1,
        deliveryStatus: DeliveryStatus.SENT,
        sent_at: "2026-08-22T10:00:00.000Z",
      });

      const persistedPackage = createPackage({
        id: 1,
        status: PackageStatus.EM_ROTA_DE_ENTREGA,
        deliveryStatus: DeliveryStatus.PENDING,
        sent_at: undefined,
        receiverName: undefined,
      });

      repository.findById.mockReturnValue(persistedPackage);

      syncGateway.send.mockResolvedValue({
        success: true,
      });

      await service.updateAndSendMultiple(
        [pkg],
        "user-1",
        PackageStatus.EM_ROTA_DE_ENTREGA,
      );

      expect(syncGateway.send).toHaveBeenCalledWith(
        persistedPackage,
      );
    });

    it("requires a receiver for batch delivered status", async () => {
      const result = await service.updateAndSendMultiple(
        [createPackage()],
        "user-1",
        PackageStatus.ENTREGUE,
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
        createPackage({
          id: 1,
          code: "PKG-001",
        }),
        createPackage({
          id: 2,
          code: "PKG-002",
        }),
      ];

      repository.batchUpdateStatus.mockImplementation(
        () => {
          throw new Error("SQLite write failed");
        },
      );

      const result = await service.updateAndSendMultiple(
        packages,
        "user-1",
        PackageStatus.EM_ROTA_DE_ENTREGA,
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
