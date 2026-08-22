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
    it("sends the current version as pending even when the previous version was sent", async () => {
      const pkg = createPackage({
        status: PackageStatus.ENTREGUE,
        deliveryStatus: DeliveryStatus.SENT,
        sent_at: "2026-08-22T11:00:00.000Z",
        receiverName: "João",
      });

      syncGateway.send.mockResolvedValue({
        success: true,
      });

      await service.syncPackage(pkg, "João");

      expect(syncGateway.send).toHaveBeenCalledWith(
        {
          ...pkg,
          deliveryStatus: DeliveryStatus.PENDING,
          sent_at: undefined,
        },
        "João",
      );
    });

    it("marks the package as sent only after a successful webhook", async () => {
      const pkg = createPackage();

      syncGateway.send.mockResolvedValue({
        success: true,
      });

      const result = await service.syncPackage(pkg);

      expect(result.success).toBe(true);

      expect(syncGateway.send).toHaveBeenCalledTimes(1);

      expect(repository.markAsSent).toHaveBeenCalledTimes(
        1,
      );

      expect(repository.markAsSent).toHaveBeenCalledWith(
        1,
        "user-1",
      );
    });

    it("does not mark the package as sent when the webhook fails", async () => {
      const pkg = createPackage();

      syncGateway.send.mockResolvedValue({
        success: false,
      });

      const result = await service.syncPackage(pkg);

      expect(result.success).toBe(false);

      expect(repository.markAsSent).not.toHaveBeenCalled();

      expect(result.error?.code).toBe(
        PackageErrorCode.SYNC_FAILED,
      );
    });

    it("does not mark the package as sent when the gateway throws", async () => {
      const pkg = createPackage();

      syncGateway.send.mockRejectedValue(
        new Error("Network error"),
      );

      const result = await service.syncPackage(pkg);

      expect(result.success).toBe(false);

      expect(repository.markAsSent).not.toHaveBeenCalled();

      expect(result.error?.code).toBe(
        PackageErrorCode.SYNC_FAILED,
      );
    });

    it("rejects synchronization when the package has no id", async () => {
      const pkg = createPackage({
        id: undefined,
      });

      const result = await service.syncPackage(pkg);

      expect(result.success).toBe(false);

      expect(result.error?.code).toBe(
        PackageErrorCode.INVALID_FOR_SYNC,
      );

      expect(syncGateway.send).not.toHaveBeenCalled();

      expect(repository.markAsSent).not.toHaveBeenCalled();
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
        deliveryStatus: DeliveryStatus.SENT,
        sent_at: "2026-08-22T10:00:00.000Z",
      });

      syncGateway.send.mockResolvedValue({
        success: true,
      });

      await service.updateAndSendMultiple(
        [pkg],
        "user-1",
        PackageStatus.EM_ROTA_DE_ENTREGA,
      );

      expect(syncGateway.send).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          status: PackageStatus.EM_ROTA_DE_ENTREGA,
          deliveryStatus: DeliveryStatus.PENDING,
          sent_at: undefined,
        }),
        undefined,
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
