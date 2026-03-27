import cors from "cors";
import express, { json } from "express";
import { TemplateUseCase } from "../../application/use-cases/TemplateUseCase.js";
import { TemplateController } from "../controllers/TemplateController.js";
import { SqliteClient } from "../repositories/sqlite/sqlite.client.js";
import { TemplateRepository } from "../repositories/TemplateRepository.js";
import { createTemplateRoutes } from "../routes/TemplateRoutes.js";

interface Options {
  port?: number;
}

export class Server {
  private readonly app = express();
  private readonly port: number;
  private readonly mockController: TemplateController;
  // private readonly mockRuntimeController: MockController;

  constructor(options: Options) {
    const { port = 3000 } = options;

    this.port = port;

    const sqliteClient = new SqliteClient();
    const mockRepository = new TemplateRepository(sqliteClient);
    // const mockStateRepository = new MockStateRepository(sqliteClient);

    const mockUseCase = new TemplateUseCase(mockRepository);
    // const mockRuntimeUseCase = new MockUseCase(mockRepository, mockStateRepository);

    this.mockController = new TemplateController(mockUseCase);
    // this.mockRuntimeController = new MockController(mockRuntimeUseCase);
  }

  public start() {
    this.app.disable("x-powered-by");
    this.app.use(json());
    this.app.use(cors());
    this.app.use("/api/templates", createTemplateRoutes(this.mockController));
    // this.app.use("/api/mocks", createMockRuntimeRoutes(this.mockRuntimeController));

    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }
}
