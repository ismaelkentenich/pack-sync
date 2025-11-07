import { setupAuthDatabase } from "./auth/setup";

export async function setupAllDatabases() {
  await Promise.all([
    setupAuthDatabase(),
  ]);
  console.log("Todos os bancos de dados foram inicializados.");
}
