import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

export interface SqliteClientOptions {
  filename?: string;
}

export class SqliteClient {
  private readonly sqlite: Database.Database;
  private readonly connection: BetterSQLite3Database;

  constructor(options: SqliteClientOptions = {}) {
    const { filename = "mockit.sqlite" } = options;

    this.sqlite = new Database(filename);
    this.sqlite.pragma("journal_mode = WAL");
    this.sqlite.pragma("foreign_keys = ON");
    this.connection = drizzle(this.sqlite);

    this.bootstrap();
  }

  public get db() {
    return this.connection;
  }

  private bootstrap() {
    this.sqlite.exec(`
      CREATE TABLE IF NOT EXISTS MOCK (
        ID TEXT PRIMARY KEY,
        DATA TEXT NOT NULL,
        CREATED_AT INTEGER NOT NULL,
        UPDATED_AT INTEGER NOT NULL
      );
    `);
  }
}
