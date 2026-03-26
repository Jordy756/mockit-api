import express, { json } from "express";
import cors from "cors";
import { RegisterMockUseCase } from "../../application/use-cases/MockUseCase.js";
import { MockController } from "../controllers/MockController.js";
import { DrizzleMockRepository } from "../repositories/MockRepository.js";
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
    const mockRepository = new DrizzleMockRepository(sqliteClient);
    const registerMockUseCase = new RegisterMockUseCase(mockRepository);

    this.mockController = new MockController(registerMockUseCase);
  }

  public start() {
    this.app.use(json());
    this.app.use(cors());
    this.app.use("/api/mocks", createMockRoutes(this.mockController));

    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }
}
