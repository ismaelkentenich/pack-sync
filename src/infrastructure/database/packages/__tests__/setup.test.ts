import { packagesDb } from "../index";
import { migrateToAddSyncVersion } from "../migrations/migrateToAddSyncVersion";
import { migrateToMultiUserIdentity } from "../migrations/migrateToMultiUserIdentity";
import {
  createPackagesIndexes,
  createPackagesTable,
  PACKAGES_SCHEMA_VERSION,
} from "../schema";
import { setupPackagesDatabase } from "../setup";

jest.mock("../index", () => ({
  packagesDb: {
    getFirstSync: jest.fn(),
    execSync: jest.fn(),
    runSync: jest.fn(),
    withTransactionSync: jest.fn((callback: () => void) => {
      callback();
    }),
  },
}));

jest.mock("../schema", () => ({
  PACKAGES_SCHEMA_VERSION: 2,
  createPackagesTable: jest.fn(),
  createPackagesIndexes: jest.fn(),
}));

jest.mock(
  "../migrations/migrateToMultiUserIdentity",
  () => ({
    migrateToMultiUserIdentity: jest.fn(),
  }),
);

jest.mock("../migrations/migrateToAddSyncVersion", () => ({
  migrateToAddSyncVersion: jest.fn(),
}));

describe("setupPackagesDatabase", () => {
  const getFirstSyncMock = jest.mocked(
    packagesDb.getFirstSync,
  );
  const execSyncMock = jest.mocked(packagesDb.execSync);
  const createPackagesTableMock = jest.mocked(
    createPackagesTable,
  );
  const createPackagesIndexesMock = jest.mocked(
    createPackagesIndexes,
  );
  const migrateToMultiUserIdentityMock = jest.mocked(
    migrateToMultiUserIdentity,
  );
  const migrateToAddSyncVersionMock = jest.mocked(
    migrateToAddSyncVersion,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates tables and indexes on fresh install when table does not exist", () => {
    getFirstSyncMock.mockReturnValue(null);

    setupPackagesDatabase();

    expect(createPackagesTableMock).toHaveBeenCalledTimes(
      1,
    );
    expect(createPackagesIndexesMock).toHaveBeenCalledTimes(
      1,
    );
    expect(execSyncMock).toHaveBeenCalledWith(
      `PRAGMA user_version = ${PACKAGES_SCHEMA_VERSION};`,
    );
    expect(
      migrateToMultiUserIdentityMock,
    ).not.toHaveBeenCalled();
    expect(
      migrateToAddSyncVersionMock,
    ).not.toHaveBeenCalled();
  });

  it("runs full migration chain when upgrading from version 0 (legacy)", () => {
    getFirstSyncMock
      .mockReturnValueOnce({ name: "packages" }) // packagesTableExists
      .mockReturnValueOnce({ user_version: 0 }) // getDatabaseVersion initial
      .mockReturnValueOnce({ user_version: 2 }); // getDatabaseVersion updated

    setupPackagesDatabase();

    expect(
      migrateToMultiUserIdentityMock,
    ).toHaveBeenCalledTimes(1);
    expect(
      migrateToAddSyncVersionMock,
    ).toHaveBeenCalledTimes(1);
    expect(createPackagesIndexesMock).toHaveBeenCalledTimes(
      1,
    );
  });

  it("runs incremental migration when upgrading from schema version 1 to 2", () => {
    getFirstSyncMock
      .mockReturnValueOnce({ name: "packages" }) // packagesTableExists
      .mockReturnValueOnce({ user_version: 1 }) // getDatabaseVersion initial
      .mockReturnValueOnce({ user_version: 2 }); // getDatabaseVersion updated

    setupPackagesDatabase();

    expect(
      migrateToMultiUserIdentityMock,
    ).not.toHaveBeenCalled();
    expect(
      migrateToAddSyncVersionMock,
    ).toHaveBeenCalledTimes(1);
    expect(createPackagesIndexesMock).toHaveBeenCalledTimes(
      1,
    );
  });

  it("skips migrations when database is already at the current schema version", () => {
    getFirstSyncMock
      .mockReturnValueOnce({ name: "packages" }) // packagesTableExists
      .mockReturnValueOnce({ user_version: 2 }) // getDatabaseVersion initial
      .mockReturnValueOnce({ user_version: 2 }); // getDatabaseVersion updated

    setupPackagesDatabase();

    expect(
      migrateToMultiUserIdentityMock,
    ).not.toHaveBeenCalled();
    expect(
      migrateToAddSyncVersionMock,
    ).not.toHaveBeenCalled();
    expect(createPackagesIndexesMock).toHaveBeenCalledTimes(
      1,
    );
  });

  it("throws error when database version is greater than supported schema version", () => {
    getFirstSyncMock
      .mockReturnValueOnce({ name: "packages" }) // packagesTableExists
      .mockReturnValueOnce({ user_version: 99 }) // getDatabaseVersion initial
      .mockReturnValueOnce({ user_version: 99 }); // getDatabaseVersion updated

    expect(() => setupPackagesDatabase()).toThrow(
      "Versão do banco não suportada. Atual: 99. Suportada: 2.",
    );
  });

  it("propagates error when migration fails without continuing silently", () => {
    getFirstSyncMock
      .mockReturnValueOnce({ name: "packages" })
      .mockReturnValueOnce({ user_version: 1 });

    migrateToAddSyncVersionMock.mockImplementationOnce(
      () => {
        throw new Error("Migration failed: disk I/O error");
      },
    );

    expect(() => setupPackagesDatabase()).toThrow(
      "Migration failed: disk I/O error",
    );
  });
});
