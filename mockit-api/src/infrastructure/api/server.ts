import cors from "cors";
import express, { json } from "express";
import { TemplateUseCase } from "../../application/use-cases/TemplateUseCase.js";
import { TemplateController } from "../controllers/TemplateController.js";
import { TemplateRepository } from "../repositories/TemplateRepository.js";
import { SqliteClient } from "../repositories/sqlite/sqlite.client.js";
import { createTemplateRoutes } from "../routes/TemplateRoutes.js";
import { createMockRoutes } from "../routes/MockRoutes.js";
import { MockRepository } from "../repositories/MockRepository.js";
import { MockUseCase } from "../../application/use-cases/MockUseCase.js";
import { MockController } from "../controllers/MockController.js";

interface Options {
  port?: number;
}

export class Server {
  private readonly app = express();
  private readonly port: number;
  private readonly templateController: TemplateController;
  private readonly mockController: MockController;

  constructor(options: Options) {
    const { port = 3000 } = options;

    this.port = port;

    const sqliteClient = new SqliteClient();
    const templateRepository = new TemplateRepository(sqliteClient);
    const mockRepository = new MockRepository(sqliteClient);

    const templateUseCase = new TemplateUseCase(templateRepository);
    const mockUseCase = new MockUseCase(mockRepository);

    this.templateController = new TemplateController(templateUseCase);
    this.mockController = new MockController(mockUseCase);
  }

  public start() {
    this.app.disable("x-powered-by");
    this.app.use(json());
    this.app.use(cors());
    this.app.use("/api/templates", createTemplateRoutes(this.templateController));
    this.app.use("/api/mocks", createMockRoutes(this.mockController));

    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }
}
