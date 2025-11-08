import { getFirstSync, runSync } from "./index";

export function saveSession(userId: number): void {
  try {
    runSync(`INSERT OR REPLACE INTO session (id, user_id) VALUES (1, ${userId})`);
  } catch (error) {
    console.error("[DB ERROR] saveSession:", error);
  }
}

export function clearSession(): void {
  try {
    runSync(`DELETE FROM session WHERE id = 1`);
  } catch (error) {
    console.error("[DB ERROR] clearSession:", error);
  }
}

export function getSessionUserId(): number | null {
  try {
    const result = getFirstSync<{ user_id: number }>(`SELECT user_id FROM session WHERE id = 1`);
    const userId = result?.user_id ?? null;
    return userId;
  } catch (error) {
    console.error("[DB ERROR] getSessionUserId:", error);
    return null;
  }
}
