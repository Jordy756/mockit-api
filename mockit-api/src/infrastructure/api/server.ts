import "reflect-metadata";
import cors from "cors";
import express, { json } from "express";
import { useContainer, useExpressServer } from "routing-controllers";
import { container } from "../di/container.js";
import { TYPES } from "../di/types.js";
import { MockController } from "../controllers/MockController.js";
import { MockRecordController } from "../controllers/MockRecordController.js";

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
