import "reflect-metadata";
import { Container } from "inversify";
import { GoogleGenAI } from "@google/genai";
import { TYPES } from "./types.js";
import { SqliteClient } from "../repositories/sqlite/sqlite.client.js";
import { MockRecordRepository } from "../repositories/MockRecordRepository.js";
import { MockRepository } from "../repositories/MockRepository.js";
import type { IMockRecordRepository } from "../../domain/interfaces/repositories/IMockRecordRepository.js";
import type { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import { MockRecordUseCase } from "../../application/use-cases/MockRecordUseCase.js";
import { MockUseCase } from "../../application/use-cases/MockUseCase.js";
import type { IMockRecordUseCase } from "../../domain/interfaces/use-cases/IMockRecordUseCase.js";
import type { IMockUseCase } from "../../domain/interfaces/use-cases/IMockUseCase.js";
import { MockRecordController } from "../controllers/MockRecordController.js";
import { MockController } from "../controllers/MockController.js";
import { GeminiDataGeneratorHelper } from "../helpers/GeminiDataGeneratorHelper.js";
import type { IAiDataGeneratorHelper } from "../../domain/interfaces/helpers/IAiDataGeneratorHelper.js";
import { GOOGLE_GEMINI_API_KEY, GOOGLE_GEMINI_API_MODEL, LLM_RESPONSE_MINE_TYPE } from "../../domain/config/Environment.js";

const container = new Container();

container.bind(TYPES.SqliteClient).to(SqliteClient).inSingletonScope();

container.bind<IMockRecordRepository>(TYPES.IMockRecordRepository).to(MockRecordRepository).inSingletonScope();
container.bind<IMockRepository>(TYPES.IMockRepository).to(MockRepository).inSingletonScope();

container.bind<IAiDataGeneratorHelper>(TYPES.IAiDataGeneratorHelper).toDynamicValue(() => {
  const ai = new GoogleGenAI({ apiKey: GOOGLE_GEMINI_API_KEY ?? "" });
  return new GeminiDataGeneratorHelper(ai, GOOGLE_GEMINI_API_MODEL ?? "", LLM_RESPONSE_MINE_TYPE ?? "");
}).inSingletonScope();

container.bind<IMockRecordUseCase>(TYPES.IMockRecordUseCase).to(MockRecordUseCase).inSingletonScope();
container.bind<IMockUseCase>(TYPES.IMockUseCase).to(MockUseCase).inSingletonScope();

container.bind(TYPES.MockRecordController).to(MockRecordController).inSingletonScope();
container.bind(TYPES.MockController).to(MockController).inSingletonScope();

export { container };
