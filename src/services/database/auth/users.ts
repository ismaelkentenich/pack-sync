import { getFirstSync, runSync } from "../index";

export type User = {
  id?: number;
  email: string;
};

export function insertUser(user: User) {
  const safeEmail = user.email.replace(/'/g, "''");
  runSync(`INSERT INTO users (email) VALUES ('${safeEmail}')`);
}

export function getUserByEmail(email: string) {
  const safeEmail = email.replace(/'/g, "''");
  return getFirstSync<User>(`SELECT * FROM users WHERE email = '${safeEmail}'`);
}
