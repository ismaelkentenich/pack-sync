import { setupPackagesDatabase } from "./packages/setup";

export function setupAllDatabases(): void {
  setupPackagesDatabase();

  console.log(
    "Todos os bancos de dados foram inicializados.",
  );
}
