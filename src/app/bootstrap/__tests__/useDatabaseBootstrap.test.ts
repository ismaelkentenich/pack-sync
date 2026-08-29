import {
  act,
  renderHook,
} from "@testing-library/react-native";
import { useDatabaseBootstrap } from "@hooks/useDatabaseBootstrap";
import { setupAllDatabases } from "@infrastructure/database/setup";

jest.mock("@infrastructure/database/setup", () => ({
  setupAllDatabases: jest.fn(),
}));

const setupAllDatabasesMock = jest.mocked(
  setupAllDatabases,
);

describe("useDatabaseBootstrap", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sets status to ready on successful database setup", async () => {
    setupAllDatabasesMock.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() =>
      useDatabaseBootstrap(),
    );

    expect(result.current.status).toBe("loading");

    await act(async () => {});

    expect(result.current.status).toBe("ready");
    expect(result.current.errorMessage).toBeUndefined();
    expect(setupAllDatabasesMock).toHaveBeenCalledTimes(1);
  });

  it("sets status to error when setupAllDatabases fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    setupAllDatabasesMock.mockRejectedValueOnce(
      new Error("Database initialization failed"),
    );

    const { result } = renderHook(() =>
      useDatabaseBootstrap(),
    );

    await act(async () => {});

    expect(result.current.status).toBe("error");
    expect(result.current.errorMessage).toBe(
      "Database initialization failed",
    );

    consoleErrorSpy.mockRestore();
  });

  it("retries bootstrap when handleRetry is invoked", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    setupAllDatabasesMock
      .mockRejectedValueOnce(new Error("Initial failure"))
      .mockResolvedValueOnce(undefined);

    const { result } = renderHook(() =>
      useDatabaseBootstrap(),
    );

    await act(async () => {});

    expect(result.current.status).toBe("error");

    await act(async () => {
      result.current.handleRetry();
    });

    expect(result.current.status).toBe("ready");
    expect(setupAllDatabasesMock).toHaveBeenCalledTimes(2);

    consoleErrorSpy.mockRestore();
  });
});
