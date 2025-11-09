import { runSync } from "./index";

export const setupPackagesDatabase = () => {
  runSync(`
    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL DEFAULT 'Coletado',
      deliveryStatus TEXT NOT NULL DEFAULT 'pending',
      clientCode INTEGER,
      scanned_at TEXT NOT NULL,
      sent_at TEXT,
      receiverName TEXT
    );
  `);
};
