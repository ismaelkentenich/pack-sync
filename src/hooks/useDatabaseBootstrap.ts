import { useCallback, useEffect, useState } from "react";
import { setupAllDatabases } from "@infrastructure/database/setup";

export type DatabaseBootstrapStatus =
  "loading" | "ready" | "error";

export function useDatabaseBootstrap() {
  const [status, setStatus] =
    useState<DatabaseBootstrapStatus>("loading");

  const executeBootstrap = useCallback(async () => {
    try {
      await setupAllDatabases();
      setStatus("ready");
    } catch (error) {
      console.error("[Database] bootstrap:error", error);
      setStatus("error");
    }
  }, []);

  const handleRetry = useCallback(() => {
    setStatus("loading");
    executeBootstrap();
  }, [executeBootstrap]);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      try {
        await setupAllDatabases();
        if (isMounted) {
          setStatus("ready");
        }
      } catch (error) {
        if (isMounted) {
          console.error(
            "[Database] bootstrap:error",
            error,
          );
          setStatus("error");
        }
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    status,
    handleRetry,
  };
}
