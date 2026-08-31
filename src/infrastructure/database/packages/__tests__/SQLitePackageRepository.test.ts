import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import { Package } from "@features/packages/domain/package.types";
import { mapRowToPackage } from "@infrastructure/database/packages/mappers/package.mapper";
import { SQLitePackageRepository } from "@infrastructure/database/packages/SQLitePackageRepository";
import { PackageRow } from "@infrastructure/database/packages/types/package.row";
import { packagesDb } from "../index";

jest.mock(
  "@infrastructure/database/packages/index",
  () => ({
    packagesDb: {
      runSync: jest.fn(),
      getFirstSync: jest.fn(),
      getAllSync: jest.fn(),

      withTransactionSync: jest.fn(
        (callback: () => void) => {
          callback();
        },
      ),
    },
  }),
);

describe("SQLitePackageRepository & mapRowToPackage", () => {
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

  describe("SQLitePackageRepository", () => {
    describe("mapRowToPackage", () => {
      it("maps SQLite raw row correctly into domain Package entity", () => {
        const rawRow: PackageRow = {
          id: 101,
          code: "PKG-RAW-01",
          status: PackageStatus.DELIVERED,
          deliveryStatus: DeliveryStatus.SENT,
          clientCode: "user-123",
          scanned_at: "2026-08-31T10:00:00.000Z",
          sent_at: "2026-08-31T11:00:00.000Z",
          receiverName: "Maria Silva",
          syncVersion: 2,
        };

        const domainPackage = mapRowToPackage(rawRow);

        expect(domainPackage).toEqual({
          id: "101",
          code: "PKG-RAW-01",
          status: PackageStatus.DELIVERED,
          deliveryStatus: DeliveryStatus.SENT,
          clientCode: "user-123",
          scanned_at: "2026-08-31T10:00:00.000Z",
          sent_at: "2026-08-31T11:00:00.000Z",
          receiverName: "Maria Silva",
          syncVersion: 2,
        });
      });

      it("normalizes null and undefined optional values safely", () => {
        const rawRow: PackageRow = {
          id: "202",
          code: "PKG-RAW-02",
          status: PackageStatus.COLLECTED,
          deliveryStatus: DeliveryStatus.PENDING,
          clientCode: "user-123",
          scanned_at: "2026-08-31T10:00:00.000Z",
          sent_at: null,
          receiverName: null,
          syncVersion: null,
        };

        const domainPackage = mapRowToPackage(rawRow);

        expect(domainPackage.id).toBe("202");
        expect(domainPackage.sent_at).toBeUndefined();
        expect(domainPackage.receiverName).toBeUndefined();
        expect(domainPackage.syncVersion).toBe(1);
      });
    });

    describe("findById", () => {
      it("finds the package by id and user through row mapper", () => {
        const row: PackageRow = {
          id: 10,
          code: "PKG-010",
          status: PackageStatus.DELIVERED,
          deliveryStatus: DeliveryStatus.PENDING,
          clientCode: "user-1",
          scanned_at: "2026-08-22T12:00:00.000Z",
          receiverName: "João",
          sent_at: null,
          syncVersion: 1,
        };

        getFirstSyncMock.mockReturnValue(row);

        const result = repository.findById("10", "user-1");

        expect(getFirstSyncMock).toHaveBeenCalledTimes(1);
        expect(getFirstSyncMock).toHaveBeenCalledWith(
          expect.stringContaining("WHERE id = ?"),
          ["10", "user-1"],
        );
        expect(result).toEqual(mapRowToPackage(row));
      });

      it("returns null when the package does not belong to the user", () => {
        getFirstSyncMock.mockReturnValue(null);

        const result = repository.findById("10", "user-2");

        expect(result).toBeNull();
      });
    });

    describe("findByCode", () => {
      it("scopes package lookup by code and user", () => {
        const row: PackageRow = {
          id: 1,
          code: "PKG-SHARED",
          status: PackageStatus.COLLECTED,
          deliveryStatus: DeliveryStatus.PENDING,
          clientCode: "user-1",
          scanned_at: "2026-08-22T12:00:00.000Z",
        };

        getFirstSyncMock.mockReturnValue(row);

        const result = repository.findByCode(
          "PKG-SHARED",
          "user-1",
        );

        expect(getFirstSyncMock).toHaveBeenCalledWith(
          expect.stringContaining("code = ?"),
          ["PKG-SHARED", "user-1"],
        );
        expect(result).toEqual(mapRowToPackage(row));
      });
    });

    describe("findAllByUser", () => {
      it("returns only packages scoped to the user mapped to domain entities", () => {
        const rows: PackageRow[] = [
          {
            id: 1,
            code: "PKG-001",
            status: PackageStatus.COLLECTED,
            deliveryStatus: DeliveryStatus.PENDING,
            clientCode: "user-1",
            scanned_at: "2026-08-22T12:00:00.000Z",
          },
          {
            id: 2,
            code: "PKG-002",
            status: PackageStatus.DELIVERED,
            deliveryStatus: DeliveryStatus.SENT,
            clientCode: "user-1",
            scanned_at: "2026-08-22T12:10:00.000Z",
            receiverName: "Maria",
          },
        ];

        getAllSyncMock.mockReturnValue(rows);

        const result = repository.findAllByUser("user-1");

        expect(getAllSyncMock).toHaveBeenCalledWith(
          expect.stringContaining("clientCode = ?"),
          ["user-1"],
        );
        expect(result).toEqual(rows.map(mapRowToPackage));
      });
    });

    describe("findByDeliveryStatus", () => {
      it("finds packages by delivery status only for the requested user", () => {
        const rows: PackageRow[] = [
          {
            id: 1,
            code: "PKG-001",
            status: PackageStatus.COLLECTED,
            deliveryStatus: DeliveryStatus.PENDING,
            clientCode: "user-1",
            scanned_at: "2026-08-22T12:00:00.000Z",
          },
        ];

        getAllSyncMock.mockReturnValue(rows);

        const result = repository.findByDeliveryStatus(
          "user-1",
          DeliveryStatus.PENDING,
        );

        expect(result).toEqual(rows.map(mapRowToPackage));
      });
    });

    describe("create", () => {
      it("persists the package and recovers mapped entity", () => {
        const pkg: Package = {
          code: "PKG-001",
          status: PackageStatus.COLLECTED,
          deliveryStatus: DeliveryStatus.PENDING,
          clientCode: "user-1",
          scanned_at: "2026-08-22T12:00:00.000Z",
          syncVersion: 1,
        };

        const row: PackageRow = {
          ...pkg,
          id: 1,
        };

        getFirstSyncMock.mockReturnValue(row);

        const result = repository.create(pkg);

        expect(runSyncMock).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mapRowToPackage(row));
      });

      it("throws when the created package cannot be recovered", () => {
        const pkg: Package = {
          code: "PKG-001",
          status: PackageStatus.COLLECTED,
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
      it("invalidates the previous synchronization state and increments syncVersion", () => {
        repository.updateStatus(
          "10",
          "user-1",
          PackageStatus.DELIVERED,
          "João",
        );

        expect(runSyncMock).toHaveBeenCalledTimes(1);
        const [sql, params] = runSyncMock.mock.calls[0];

        expect(sql).toContain("status = ?");
        expect(sql).toContain("receiverName = ?");
        expect(sql).toContain("deliveryStatus = ?");
        expect(sql).toContain("sent_at = NULL");
        expect(sql).toContain(
          "syncVersion = COALESCE(syncVersion, 1) + 1",
        );
        expect(params).toEqual([
          PackageStatus.DELIVERED,
          "João",
          DeliveryStatus.PENDING,
          "10",
          "user-1",
        ]);
      });
    });

    describe("markAsSent", () => {
      it("marks the package as sent conditionally for the exact syncVersion", () => {
        repository.markAsSent("10", "user-1", 1);

        expect(runSyncMock).toHaveBeenCalledTimes(1);
        const [sql, params] = runSyncMock.mock.calls[0];

        expect(sql).toContain("deliveryStatus = ?");
        expect(sql).toContain("sent_at = ?");
        expect(sql).toContain("syncVersion = ?");
        expect(params).toHaveLength(5);
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

        expect(result).toBe(3);
      });
    });

    describe("delete", () => {
      it("deletes the package only for the requested user", () => {
        repository.delete("10", "user-1");

        expect(runSyncMock).toHaveBeenCalledTimes(1);
        expect(runSyncMock).toHaveBeenCalledWith(
          expect.stringContaining("DELETE FROM packages"),
          ["10", "user-1"],
        );
      });
    });

    describe("batchUpdateStatus", () => {
      it("updates all packages inside a single transaction", () => {
        repository.batchUpdateStatus(
          ["1", "2", "3"],
          "user-1",
          PackageStatus.IN_DELIVERY,
        );

        expect(
          withTransactionSyncMock,
        ).toHaveBeenCalledTimes(1);
        expect(runSyncMock).toHaveBeenCalledTimes(3);
      });
    });
  });
});
