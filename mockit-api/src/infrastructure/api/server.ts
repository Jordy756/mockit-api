import cors from "cors";
import express, { json } from "express";
import { MockRecordUseCase } from "../../application/use-cases/MockRecordUseCase.js";
import { MockUseCase } from "../../application/use-cases/MockUseCase.js";
import { MockController } from "../controllers/MockController.js";
import { MockRecordController } from "../controllers/MockRecordController.js";
import { MockRecordRepository } from "../repositories/MockRecordRepository.js";
import { MockRepository } from "../repositories/MockRepository.js";
import { SqliteClient } from "../repositories/sqlite/sqlite.client.js";
import { createMockRecordRoutes } from "../routes/MockRecordRoutes.js";
import { createMockRoutes } from "../routes/MockRoutes.js";
import { GeminiDataGeneratorHelper } from "../helpers/GeminiDataGeneratorHelper.js";
import { GoogleGenAI } from "@google/genai";
import { GOOGLE_GEMINI_API_KEY, GOOGLE_GEMINI_API_MODEL, LLM_RESPONSE_MINE_TYPE } from "../../domain/config/Environment.js";

interface Options {
  port?: number;
}

export class Server {
  private readonly app = express();
  private readonly port: number;
  private readonly mockRecordController: MockRecordController;
  private readonly mockController: MockController;

  constructor(options: Options) {
    const { port = 3000 } = options;

    this.port = port;

    const aiDataGeneratorHelper = new GeminiDataGeneratorHelper(
      new GoogleGenAI(
        {
          apiKey: GOOGLE_GEMINI_API_KEY
        }
      ), 
      GOOGLE_GEMINI_API_MODEL!, 
      LLM_RESPONSE_MINE_TYPE!
    );
  
    const sqliteClient = new SqliteClient();
    const mockRecordRepository = new MockRecordRepository(sqliteClient);
    const mockRepository = new MockRepository(sqliteClient);

    const mockRecordUseCase = new MockRecordUseCase(mockRecordRepository, aiDataGeneratorHelper);
    const mockUseCase = new MockUseCase(mockRepository);

    this.mockRecordController = new MockRecordController(mockRecordUseCase);
    this.mockController = new MockController(mockUseCase);
  }

  public start() {
    this.app.disable("x-powered-by");
    this.app.use(json());
    this.app.use(cors());
    this.app.use("/api/mock-records", createMockRecordRoutes(this.mockRecordController));
    this.app.use("/api/mocks", createMockRoutes(this.mockController));

    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }
}
