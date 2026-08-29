import { useCallback, useEffect, useState } from "react";
import { setupAllDatabases } from "@infrastructure/database/setup";

export type DatabaseBootstrapStatus =
  "loading" | "ready" | "error";

export function useDatabaseBootstrap() {
  const [status, setStatus] =
    useState<DatabaseBootstrapStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<
    string | undefined
  >();

  const executeBootstrap = useCallback(async () => {
    try {
      await setupAllDatabases();
      setStatus("ready");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao inicializar o banco de dados.";
      console.error("[Database] bootstrap:error", error);
      setErrorMessage(message);
      setStatus("error");
    }
  }, []);

  const handleRetry = useCallback(() => {
    setStatus("loading");
    setErrorMessage(undefined);
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
          const message =
            error instanceof Error
              ? error.message
              : "Erro desconhecido ao inicializar o banco de dados.";
          console.error(
            "[Database] bootstrap:error",
            error,
          );
          setErrorMessage(message);
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
    errorMessage,
    handleRetry,
  };
}
