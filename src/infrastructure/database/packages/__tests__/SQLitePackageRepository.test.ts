import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
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

  const withTransactionSyncMock = jest.mocked(
    packagesDb.withTransactionSync,
  );

  beforeEach(() => {
    repository = new SQLitePackageRepository();

    jest.clearAllMocks();
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

    it("does not open a transaction when there are no packages", () => {
      repository.batchUpdateStatus(
        [],
        "user-1",
        PackageStatus.COLETADO,
      );

      expect(
        withTransactionSyncMock,
      ).not.toHaveBeenCalled();

      expect(runSyncMock).not.toHaveBeenCalled();
    });
  });

  describe("markAsSent", () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it("marks the package as sent and persists sent_at", () => {
      jest.useFakeTimers();

      jest.setSystemTime(
        new Date("2026-08-22T12:00:00.000Z"),
      );

      repository.markAsSent(1, "user-1");

      expect(runSyncMock).toHaveBeenCalledTimes(1);

      expect(runSyncMock).toHaveBeenCalledWith(
        expect.stringMatching(
          /SET deliveryStatus = \?,\s+sent_at = \?/,
        ),
        [
          DeliveryStatus.SENT,
          "2026-08-22T12:00:00.000Z",
          1,
          "user-1",
        ],
      );
    });
  });

  describe("findById", () => {
    it("finds the package by id and user", () => {
      const persistedPackage = {
        id: 10,
        code: "PKG-010",
        status: PackageStatus.ENTREGUE,
        deliveryStatus: DeliveryStatus.PENDING,
        clientCode: "user-1",
        scanned_at: "2026-08-22T12:00:00.000Z",
        receiverName: "João",
      };

      const getFirstSyncMock = jest.mocked(
        packagesDb.getFirstSync,
      );

      getFirstSyncMock.mockReturnValue(persistedPackage);

      const result = repository.findById(10, "user-1");

      expect(getFirstSyncMock).toHaveBeenCalledWith(
        expect.stringContaining("WHERE id = ?"),
        [10, "user-1"],
      );

      expect(result).toEqual(persistedPackage);
    });
  });
});
