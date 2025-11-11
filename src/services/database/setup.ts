import { setupPackagesDatabase } from "./packages/setup";

export async function setupAllDatabases() {
  await Promise.all([setupPackagesDatabase()]);
  console.log("Todos os bancos de dados foram inicializados.");
}
