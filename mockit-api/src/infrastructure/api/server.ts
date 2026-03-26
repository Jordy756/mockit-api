import express, { json } from "express";
import cors from "cors";
import { MockUseCase } from "../../application/use-cases/MockUseCase.js";
import { MockController } from "../controllers/MockController.js";
import { MockRepository } from "../repositories/MockRepository.js";
import { SqliteClient } from "../repositories/sqlite/sqlite.client.js";
import { createMockRoutes } from "../routes/MockRoutes.js";

interface Options {
  port?: number;
}

export class Server {
  private readonly app = express();
  private readonly port: number;
  private readonly mockController: MockController;

  constructor(options: Options) {
    const { port = 3000 } = options;

    this.port = port;

    const sqliteClient = new SqliteClient();
    const mockRepository = new MockRepository(sqliteClient);
    const mockUseCase = new MockUseCase(mockRepository);

    this.mockController = new MockController(mockUseCase);
  }

  public start() {
    this.app.disable("x-powered-by");
    this.app.use(json());
    this.app.use(cors());
    this.app.use("/api/mocks", createMockRoutes(this.mockController));

    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }
}
