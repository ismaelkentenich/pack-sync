import { setupAuthDatabase } from "./auth/setup";
import { setupPackagesDatabase } from "./packages/setup";

export async function setupAllDatabases() {
  await Promise.all([setupAuthDatabase(), setupPackagesDatabase()]);
  console.log("Todos os bancos de dados foram inicializados.");
}
