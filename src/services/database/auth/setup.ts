import { authDb } from "./index";

export async function setupAuthDatabase() {
  await authDb.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS session (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      user_id INTEGER,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);
}
