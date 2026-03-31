import "reflect-metadata";
import cors from "cors";
import express, { json } from "express";
import { useContainer, useExpressServer } from "routing-controllers";
import { container } from "../di/container.js";
import { TYPES } from "../di/types.js";
import { MockController } from "../controllers/MockController.js";
import { MockRecordController } from "../controllers/MockRecordController.js";
import { MockRecordRepository } from "../repositories/MockRecordRepository.js";
import { MockRepository } from "../repositories/MockRepository.js";
import { SqliteClient } from "../repositories/sqlite/sqlite.client.js";
import { GeminiDataGeneratorHelper } from "../helpers/GeminiDataGeneratorHelper.js";
import { GoogleGenAI } from "@google/genai";
import { GOOGLE_GEMINI_API_KEY, GOOGLE_GEMINI_API_MODEL, LLM_RESPONSE_MINE_TYPE } from "../../domain/config/Environment.js";


interface Options {
  port?: number;
}

export class Server {
  private readonly app = express();
  private readonly port: number;

  constructor(options: Options) {
    const { port = 3000 } = options;

    this.port = port;

    useContainer({
      get: (cls: any) => {
        if (cls === MockRecordController) {
          return container.get(TYPES.MockRecordController);
        }
        if (cls === MockController) {
          return container.get(TYPES.MockController);
        }
        throw new Error(`Unknown controller: ${cls.name}`);
      }
    });
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

    Container.set(MockRecordController, new MockRecordController(mockRecordUseCase));
    Container.set(MockController, new MockController(mockUseCase));

    useContainer(Container);
  }

  public start() {
    this.app.disable("x-powered-by");
    this.app.use(json());
    this.app.use(cors());

    useExpressServer(this.app, {
      controllers: [MockRecordController, MockController],
      defaultErrorHandler: false,
    });

    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }
}
