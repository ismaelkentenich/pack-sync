import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import { Package } from "@features/packages/domain/package.types";
import { packagesDb } from "../index";
import { SQLitePackageRepository } from "../SQLitePackageRepository";

jest.mock("../index", () => ({
  packagesDb: {
    runSync: jest.fn(),
    getFirstSync: jest.fn(),
    getAllSync: jest.fn(),

    withTransactionSync: jest.fn((callback: () => void) => {
      callback();
    }),
  },
}));

describe("SQLitePackageRepository", () => {
  let repository: SQLitePackageRepository;

  const runSyncMock = jest.mocked(packagesDb.runSync);

  const getFirstSyncMock = jest.mocked(
    packagesDb.getFirstSync,
  );

  const getAllSyncMock = jest.mocked(packagesDb.getAllSync);

  const withTransactionSyncMock = jest.mocked(
    packagesDb.withTransactionSync,
  );

  beforeEach(() => {
    repository = new SQLitePackageRepository();

    jest.clearAllMocks();
  });

  describe("findById", () => {
    it("finds the package by id and user", () => {
      const persistedPackage: Package = {
        id: 10,
        code: "PKG-010",
        status: PackageStatus.ENTREGUE,
        deliveryStatus: DeliveryStatus.PENDING,
        clientCode: "user-1",
        scanned_at: "2026-08-22T12:00:00.000Z",
        receiverName: "João",
      };

      getFirstSyncMock.mockReturnValue(persistedPackage);

      const result = repository.findById(10, "user-1");

      expect(getFirstSyncMock).toHaveBeenCalledTimes(1);

      expect(getFirstSyncMock).toHaveBeenCalledWith(
        expect.stringContaining("WHERE id = ?"),
        [10, "user-1"],
      );

      const [sql] = getFirstSyncMock.mock.calls[0];

      expect(sql).toContain("clientCode = ?");

      expect(result).toEqual(persistedPackage);
    });

    it("returns null when the package does not belong to the user", () => {
      getFirstSyncMock.mockReturnValue(null);

      const result = repository.findById(10, "user-2");

      expect(getFirstSyncMock).toHaveBeenCalledWith(
        expect.stringContaining("WHERE id = ?"),
        [10, "user-2"],
      );

      expect(result).toBeNull();
    });
  });

  describe("findByCode", () => {
    it("scopes package lookup by code and user", () => {
      const persistedPackage: Package = {
        id: 1,
        code: "PKG-SHARED",
        status: PackageStatus.COLETADO,
        deliveryStatus: DeliveryStatus.PENDING,
        clientCode: "user-1",
        scanned_at: "2026-08-22T12:00:00.000Z",
      };

      getFirstSyncMock.mockReturnValue(persistedPackage);

      const result = repository.findByCode(
        "PKG-SHARED",
        "user-1",
      );

      expect(getFirstSyncMock).toHaveBeenCalledTimes(1);

      expect(getFirstSyncMock).toHaveBeenCalledWith(
        expect.stringContaining("code = ?"),
        ["PKG-SHARED", "user-1"],
      );

      const [sql] = getFirstSyncMock.mock.calls[0];

      expect(sql).toContain("clientCode = ?");

      expect(result).toEqual(persistedPackage);
    });

    it("allows the same code to be queried independently for different users", () => {
      const userOnePackage: Package = {
        id: 1,
        code: "PKG-SHARED",
        status: PackageStatus.COLETADO,
        deliveryStatus: DeliveryStatus.PENDING,
        clientCode: "user-1",
        scanned_at: "2026-08-22T12:00:00.000Z",
      };

      const userTwoPackage: Package = {
        id: 2,
        code: "PKG-SHARED",
        status: PackageStatus.COLETADO,
        deliveryStatus: DeliveryStatus.PENDING,
        clientCode: "user-2",
        scanned_at: "2026-08-22T12:01:00.000Z",
      };

      getFirstSyncMock
        .mockReturnValueOnce(userOnePackage)
        .mockReturnValueOnce(userTwoPackage);

      const firstResult = repository.findByCode(
        "PKG-SHARED",
        "user-1",
      );

      const secondResult = repository.findByCode(
        "PKG-SHARED",
        "user-2",
      );

      expect(getFirstSyncMock).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("code = ?"),
        ["PKG-SHARED", "user-1"],
      );

      expect(getFirstSyncMock).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("code = ?"),
        ["PKG-SHARED", "user-2"],
      );

      expect(firstResult).toEqual(userOnePackage);
      expect(secondResult).toEqual(userTwoPackage);
    });

    it("returns null when no package exists for the user and code", () => {
      getFirstSyncMock.mockReturnValue(null);

      const result = repository.findByCode(
        "PKG-001",
        "user-2",
      );

      expect(result).toBeNull();
    });
  });

  describe("findAllByUser", () => {
    it("returns only packages scoped to the user", () => {
      const persistedPackages: Package[] = [
        {
          id: 1,
          code: "PKG-001",
          status: PackageStatus.COLETADO,
          deliveryStatus: DeliveryStatus.PENDING,
          clientCode: "user-1",
          scanned_at: "2026-08-22T12:00:00.000Z",
        },
        {
          id: 2,
          code: "PKG-002",
          status: PackageStatus.ENTREGUE,
          deliveryStatus: DeliveryStatus.SENT,
          clientCode: "user-1",
          scanned_at: "2026-08-22T12:10:00.000Z",
          receiverName: "Maria",
        },
      ];

      getAllSyncMock.mockReturnValue(persistedPackages);

      const result = repository.findAllByUser("user-1");

      expect(getAllSyncMock).toHaveBeenCalledTimes(1);

      expect(getAllSyncMock).toHaveBeenCalledWith(
        expect.stringContaining("clientCode = ?"),
        ["user-1"],
      );

      expect(result).toEqual(persistedPackages);
    });
  });

  describe("findByDeliveryStatus", () => {
    it("finds packages by delivery status only for the requested user", () => {
      const pendingPackages: Package[] = [
        {
          id: 1,
          code: "PKG-001",
          status: PackageStatus.COLETADO,
          deliveryStatus: DeliveryStatus.PENDING,
          clientCode: "user-1",
          scanned_at: "2026-08-22T12:00:00.000Z",
        },
      ];

      getAllSyncMock.mockReturnValue(pendingPackages);

      const result = repository.findByDeliveryStatus(
        "user-1",
        DeliveryStatus.PENDING,
      );

      expect(getAllSyncMock).toHaveBeenCalledTimes(1);

      expect(getAllSyncMock).toHaveBeenCalledWith(
        expect.stringContaining("clientCode = ?"),
        ["user-1", DeliveryStatus.PENDING],
      );

      const [sql] = getAllSyncMock.mock.calls[0];

      expect(sql).toContain("deliveryStatus = ?");

      expect(result).toEqual(pendingPackages);
    });
  });

  describe("create", () => {
    it("persists the package with its user identity", () => {
      const pkg: Package = {
        code: "PKG-001",
        status: PackageStatus.COLETADO,
        deliveryStatus: DeliveryStatus.PENDING,
        clientCode: "user-1",
        scanned_at: "2026-08-22T12:00:00.000Z",
      };

      const persistedPackage: Package = {
        ...pkg,
        id: 1,
      };

      getFirstSyncMock.mockReturnValue(persistedPackage);

      const result = repository.create(pkg);

      expect(runSyncMock).toHaveBeenCalledTimes(1);

      expect(runSyncMock).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO packages"),
        [
          "PKG-001",
          PackageStatus.COLETADO,
          DeliveryStatus.PENDING,
          "user-1",
          "2026-08-22T12:00:00.000Z",
        ],
      );

      expect(getFirstSyncMock).toHaveBeenCalledWith(
        expect.stringContaining("code = ?"),
        ["PKG-001", "user-1"],
      );

      expect(result).toEqual(persistedPackage);
    });

    it("recovers the created package using code and user identity", () => {
      const pkg: Package = {
        code: "PKG-SHARED",
        status: PackageStatus.COLETADO,
        deliveryStatus: DeliveryStatus.PENDING,
        clientCode: "user-2",
        scanned_at: "2026-08-22T12:00:00.000Z",
      };

      const persistedPackage: Package = {
        ...pkg,
        id: 2,
      };

      getFirstSyncMock.mockReturnValue(persistedPackage);

      repository.create(pkg);

      expect(getFirstSyncMock).toHaveBeenCalledWith(
        expect.stringContaining("code = ?"),
        ["PKG-SHARED", "user-2"],
      );
    });

    it("throws when the created package cannot be recovered", () => {
      const pkg: Package = {
        code: "PKG-001",
        status: PackageStatus.COLETADO,
        deliveryStatus: DeliveryStatus.PENDING,
        clientCode: "user-1",
        scanned_at: "2026-08-22T12:00:00.000Z",
      };

      getFirstSyncMock.mockReturnValue(null);

      expect(() => repository.create(pkg)).toThrow(
        "Failed to create package",
      );
    });
  });

  describe("updateStatus", () => {
    it("invalidates the previous synchronization state atomically", () => {
      repository.updateStatus(
        10,
        "user-1",
        PackageStatus.ENTREGUE,
        "João",
      );

      expect(runSyncMock).toHaveBeenCalledTimes(1);

      const [sql, params] = runSyncMock.mock.calls[0];

      expect(sql).toContain("status = ?");
      expect(sql).toContain("receiverName = ?");
      expect(sql).toContain("deliveryStatus = ?");
      expect(sql).toContain("sent_at = NULL");
      expect(sql).toContain("clientCode = ?");

      expect(params).toEqual([
        PackageStatus.ENTREGUE,
        "João",
        DeliveryStatus.PENDING,
        10,
        "user-1",
      ]);
    });

    it("removes receiverName when it is not provided", () => {
      repository.updateStatus(
        10,
        "user-1",
        PackageStatus.COLETADO,
      );

      const [, params] = runSyncMock.mock.calls[0];

      expect(params).toEqual([
        PackageStatus.COLETADO,
        null,
        DeliveryStatus.PENDING,
        10,
        "user-1",
      ]);
    });

    it("scopes the status update by package id and user", () => {
      repository.updateStatus(
        10,
        "user-2",
        PackageStatus.EM_ROTA_DE_ENTREGA,
      );

      const [sql, params] = runSyncMock.mock.calls[0];

      expect(sql).toContain("WHERE id = ?");
      expect(sql).toContain("clientCode = ?");

      expect(params).toEqual([
        PackageStatus.EM_ROTA_DE_ENTREGA,
        null,
        DeliveryStatus.PENDING,
        10,
        "user-2",
      ]);
    });
  });

  describe("markAsSent", () => {
    it("marks the package as sent for the correct user", () => {
      repository.markAsSent(10, "user-1");

      expect(runSyncMock).toHaveBeenCalledTimes(1);

      const [sql, params] = runSyncMock.mock.calls[0];

      expect(sql).toContain("deliveryStatus = ?");
      expect(sql).toContain("sent_at = ?");
      expect(sql).toContain("WHERE id = ?");
      expect(sql).toContain("clientCode = ?");

      expect(Array.isArray(params)).toBe(true);

      if (!Array.isArray(params)) {
        throw new Error(
          "Expected SQLite bind params to be an array",
        );
      }

      expect(params).toHaveLength(4);

      expect(params[0]).toBe(DeliveryStatus.SENT);
      expect(params[2]).toBe(10);
      expect(params[3]).toBe("user-1");

      const sentAt = params[1];

      expect(typeof sentAt).toBe("string");

      if (typeof sentAt !== "string") {
        throw new Error("Expected sent_at to be a string");
      }

      expect(Number.isNaN(Date.parse(sentAt))).toBe(false);
    });
  });

  describe("countByDeliveryStatus", () => {
    it("counts packages by user and delivery status", () => {
      getFirstSyncMock.mockReturnValue({
        count: 3,
      });

      const result = repository.countByDeliveryStatus(
        "user-1",
        DeliveryStatus.PENDING,
      );

      expect(getFirstSyncMock).toHaveBeenCalledTimes(1);

      expect(getFirstSyncMock).toHaveBeenCalledWith(
        expect.stringContaining("clientCode = ?"),
        ["user-1", DeliveryStatus.PENDING],
      );

      expect(result).toBe(3);
    });

    it("returns zero when the query does not return a count", () => {
      getFirstSyncMock.mockReturnValue(null);

      const result = repository.countByDeliveryStatus(
        "user-1",
        DeliveryStatus.PENDING,
      );

      expect(result).toBe(0);
    });
  });

  describe("delete", () => {
    it("deletes the package only for the requested user", () => {
      repository.delete(10, "user-1");

      expect(runSyncMock).toHaveBeenCalledTimes(1);

      expect(runSyncMock).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM packages"),
        [10, "user-1"],
      );

      const [sql] = runSyncMock.mock.calls[0];

      expect(sql).toContain("WHERE id = ?");
      expect(sql).toContain("clientCode = ?");
    });
  });

  describe("batchUpdateStatus", () => {
    it("updates all packages inside a single transaction", () => {
      repository.batchUpdateStatus(
        [1, 2, 3],
        "user-1",
        PackageStatus.EM_ROTA_DE_ENTREGA,
      );

      expect(withTransactionSyncMock).toHaveBeenCalledTimes(
        1,
      );

      expect(runSyncMock).toHaveBeenCalledTimes(3);
    });

    it("invalidates synchronization for every package in the batch", () => {
      repository.batchUpdateStatus(
        [1, 2],
        "user-1",
        PackageStatus.ENTREGUE,
        "Maria",
      );

      expect(runSyncMock).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("sent_at = NULL"),
        [
          PackageStatus.ENTREGUE,
          "Maria",
          DeliveryStatus.PENDING,
          1,
          "user-1",
        ],
      );

      expect(runSyncMock).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("sent_at = NULL"),
        [
          PackageStatus.ENTREGUE,
          "Maria",
          DeliveryStatus.PENDING,
          2,
          "user-1",
        ],
      );
    });

    it("scopes every batch update to the requested user", () => {
      repository.batchUpdateStatus(
        [1, 2],
        "user-2",
        PackageStatus.EM_ROTA_DE_ENTREGA,
      );

      expect(runSyncMock).toHaveBeenCalledTimes(2);

      expect(runSyncMock).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("clientCode = ?"),
        [
          PackageStatus.EM_ROTA_DE_ENTREGA,
          null,
          DeliveryStatus.PENDING,
          1,
          "user-2",
        ],
      );

      expect(runSyncMock).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("clientCode = ?"),
        [
          PackageStatus.EM_ROTA_DE_ENTREGA,
          null,
          DeliveryStatus.PENDING,
          2,
          "user-2",
        ],
      );
    });

    it("does not open a transaction for an empty package list", () => {
      repository.batchUpdateStatus(
        [],
        "user-1",
        PackageStatus.ENTREGUE,
        "Maria",
      );

      expect(
        withTransactionSyncMock,
      ).not.toHaveBeenCalled();

      expect(runSyncMock).not.toHaveBeenCalled();
    });
  });
});
