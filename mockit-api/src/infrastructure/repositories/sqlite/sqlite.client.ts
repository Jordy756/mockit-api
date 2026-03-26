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
        id TEXT PRIMARY KEY,
        payload TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);
  }
}
