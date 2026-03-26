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
    this.connection = drizzle(this.sqlite);

    this.bootstrap();
  }

  public get db() {
    return this.connection;
  }

  private bootstrap() {
    this.sqlite.exec(`
      CREATE TABLE IF NOT EXISTS mock_definitions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        method TEXT NOT NULL,
        path TEXT NOT NULL,
        status_code INTEGER NOT NULL,
        response_body TEXT NOT NULL,
        headers TEXT NOT NULL,
        delay_ms INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        CONSTRAINT mock_method_path_unique_idx UNIQUE (method, path)
      );
    `);
  }
}
