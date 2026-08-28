import { setupPackagesDatabase } from "./packages/setup";

export async function setupAllDatabases(): Promise<void> {
  setupPackagesDatabase();

  console.log(
    "Todos os bancos de dados foram inicializados.",
  );
}
