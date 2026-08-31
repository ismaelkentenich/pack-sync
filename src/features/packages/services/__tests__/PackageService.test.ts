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
} from "@test";
import { PackageService } from "../PackageService";

describe("PackageService", () => {
  let repository: jest.Mocked<PackageRepository>;
  let service: PackageService;

  beforeEach(() => {
    repository = createPackageRepositoryMock();
    service = new PackageService(repository);
  });

  describe("scanPackage", () => {
    it("allows different users to scan the same package code", async () => {
      const existingForUserOne = createPackage({
        id: "1",
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
        id: "2",
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
          status: PackageStatus.COLLECTED,
          deliveryStatus: DeliveryStatus.PENDING,
        }),
      );

      expect(result).toEqual(
        expect.objectContaining({
          id: "2",
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
        id: "1",
      }));

      const result = await service.scanPackage(
        "PKG-001",
        "user-1",
      );

      expect(result).toEqual(
        expect.objectContaining({
          id: "1",
          code: "PKG-001",
          clientCode: "user-1",
          status: PackageStatus.COLLECTED,
          deliveryStatus: DeliveryStatus.PENDING,
        }),
      );
    });
  });

  describe("changePackageStatus", () => {
    it("delegates the status update to the repository", () => {
      service.changePackageStatus(
        "1",
        "user-1",
        PackageStatus.IN_DELIVERY,
      );

      expect(repository.updateStatus).toHaveBeenCalledTimes(
        1,
      );

      expect(repository.updateStatus).toHaveBeenCalledWith(
        "1",
        "user-1",
        PackageStatus.IN_DELIVERY,
        undefined,
      );
    });

    it("requires a receiver when status is delivered", () => {
      expect(() =>
        service.changePackageStatus(
          "1",
          "user-1",
          PackageStatus.DELIVERED,
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
          "1",
          "user-1",
          PackageStatus.DELIVERED,
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

  describe("deletePackage", () => {
    it("delegates package deletion to repository", () => {
      service.deletePackage("pkg-1", "user-1");

      expect(repository.delete).toHaveBeenCalledWith(
        "pkg-1",
        "user-1",
      );
    });
  });

  describe("getAllPackages", () => {
    it("delegates user packages fetch to repository", () => {
      const pkg = createPackage({ id: "1" });
      repository.findAllByUser.mockReturnValue([pkg]);

      const result = service.getAllPackages("user-1");

      expect(repository.findAllByUser).toHaveBeenCalledWith(
        "user-1",
      );
      expect(result).toEqual([pkg]);
    });
  });

  describe("getPendingCount", () => {
    it("delegates pending count calculation to repository", () => {
      repository.countByDeliveryStatus.mockReturnValue(5);

      const result = service.getPendingCount("user-1");

      expect(
        repository.countByDeliveryStatus,
      ).toHaveBeenCalledWith(
        "user-1",
        DeliveryStatus.PENDING,
      );
      expect(result).toBe(5);
    });
  });

  describe("filterPackages", () => {
    it("filters packages by code search term and status", () => {
      const pkg1 = createPackage({
        code: "PKG-001",
        status: PackageStatus.COLLECTED,
      });
      const pkg2 = createPackage({
        code: "PKG-002",
        status: PackageStatus.DELIVERED,
      });
      const pkg3 = createPackage({
        code: "ABC-001",
        status: PackageStatus.COLLECTED,
      });

      const filtered = service.filterPackages(
        [pkg1, pkg2, pkg3],
        "pkg",
        PackageStatus.COLLECTED,
      );

      expect(filtered).toEqual([pkg1]);
    });
  });
});
