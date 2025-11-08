import { getFirstSync, runSync } from "./index";

export type User = {
  id?: number;
  email: string;
};

export function insertUser(user: User): void {
  try {
    const safeEmail = user.email.replace(/'/g, "''");
    runSync(`INSERT INTO users (email) VALUES ('${safeEmail}')`);
  } catch (error) {
    console.error("[DB ERROR] insertUser:", error);
  }
}

export function getUserByEmail(email: string): User | null {
  try {
    const safeEmail = email.replace(/'/g, "''");
    const user = getFirstSync<User>(`SELECT * FROM users WHERE email = '${safeEmail}'`);
    return user ?? null;
  } catch (error) {
    console.error("[DB ERROR] getUserByEmail:", error);
    return null;
  }
}
export function getUserById(id: number): User | null {
  try {
    const user = getFirstSync<User>(`SELECT * FROM users WHERE id = ${id}`);
    return user ?? null;
  } catch (error) {
    console.error("[DB ERROR] getUserById:", error);
    return null;
  }
}
