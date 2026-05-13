import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "keuangan_app.db";
const TABLE_NAME = "app_storage";

let databasePromise;

const getDatabase = async () => {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME).then(async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
          key TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL
        );
      `);
      return db;
    });
  }

  return databasePromise;
};

export const appStorage = {
  getItem: async (key) => {
    const db = await getDatabase();
    const row = await db.getFirstAsync(`SELECT value FROM ${TABLE_NAME} WHERE key = ?`, key);
    return row?.value ?? null;
  },
  setItem: async (key, value) => {
    const db = await getDatabase();
    await db.runAsync(`INSERT OR REPLACE INTO ${TABLE_NAME} (key, value) VALUES (?, ?)`, key, value);
  },
  removeItem: async (key) => {
    const db = await getDatabase();
    await db.runAsync(`DELETE FROM ${TABLE_NAME} WHERE key = ?`, key);
  },
};
