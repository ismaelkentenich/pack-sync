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

describe("PackageService", () => {
  let repository: jest.Mocked<PackageRepository>;
  let syncGateway: jest.Mocked<PackageSyncGateway>;
  let service: PackageService;

  beforeEach(() => {
    repository = createPackageRepositoryMock();
    syncGateway = createPackageSyncGatewayMock();

    service = new PackageService(repository, syncGateway);
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
        },
        error: undefined,
      });
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
  });
});
