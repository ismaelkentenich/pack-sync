import { authDb } from "../index";

export async function setupAuthDatabase() {
  await authDb.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL
    );
  `);
}
