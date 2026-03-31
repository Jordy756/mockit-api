import "reflect-metadata";
import cors from "cors";
import express, { json } from "express";
import { useContainer, useExpressServer } from "routing-controllers";
import { container } from "../di/container.js";
import { TYPES } from "../di/types.js";
import { MockController } from "../controllers/MockController.js";
import { MockRecordController } from "../controllers/MockRecordController.js";
import {
  RATE_LIMIT_TIME_LAPSE,
  RATE_LIMIT_REQUEST_LIMIT,
  RATE_LIMIT_LEGACY_HEADERS,
} from "../../domain/config/Environment.js";
import rateLimit from "express-rate-limit";

interface Options {
  port?: number;
}

export class Server {
  private readonly app = express();
  private readonly port: number;
  private readonly rateLimit = rateLimit({
    windowMs: parseInt(RATE_LIMIT_TIME_LAPSE!),
    limit: parseInt(RATE_LIMIT_REQUEST_LIMIT!),
    message: {
      error: "Demasiadas solicitudes. Has superado el límite permitido. Por favor, inténtalo de nuevo más tarde.",
    },
    legacyHeaders: Boolean(RATE_LIMIT_LEGACY_HEADERS!),
    standardHeaders: "draft-8",
  });

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
      },
    });
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
