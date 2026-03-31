import "reflect-metadata";
import cors from "cors";
import express, { json } from "express";
import { useContainer, useExpressServer } from "routing-controllers";
import { Container } from "typedi";
import { MockRecordUseCase } from "../../application/use-cases/MockRecordUseCase.js";
import { MockUseCase } from "../../application/use-cases/MockUseCase.js";
import { MockController } from "../controllers/MockController.js";
import { MockRecordController } from "../controllers/MockRecordController.js";
import { MockRecordRepository } from "../repositories/MockRecordRepository.js";
import { MockRepository } from "../repositories/MockRepository.js";
import { SqliteClient } from "../repositories/sqlite/sqlite.client.js";
import { GeminiDataGeneratorHelper } from "../helpers/GeminiDataGeneratorHelper.js";
import { GoogleGenAI } from "@google/genai";
import { GOOGLE_GEMINI_API_KEY, GOOGLE_GEMINI_API_MODEL, LLM_RESPONSE_MINE_TYPE } from "../../domain/config/Environment.js";
import rateLimit from "express-rate-limit";
import { error } from "node:console";

interface Options {
  port?: number;
}

export class Server {
  private readonly app = express();
  private readonly port: number;
  private readonly rateLimit = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    message: { error: "Se realizaron demaciadas solicitudes un muy poco tiempo." },
    legacyHeaders: false,
    standardHeaders: "draft-8"
  });

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

    Container.set(MockRecordController, new MockRecordController(mockRecordUseCase));
    Container.set(MockController, new MockController(mockUseCase));

    useContainer(Container);
  }

  public start() {
    this.app.disable("x-powered-by");
    this.app.use(json());
    this.app.use(cors());
    this.app.set("trust proxy", 1);
    this.app.use(this.rateLimit);

    useExpressServer(this.app, {
      controllers: [MockRecordController, MockController],
      defaultErrorHandler: false,
    });

    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }
}
