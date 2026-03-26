import express, { json } from "express";
import cors from "cors";

interface Options {
  port?: number;
}

export class Server {
  private readonly app = express();
  private readonly port: number;

  constructor(options: Options) {
    const { port = 3000 } = options;

    this.port = port;
  }

  public start() {
    this.app.use(json());
    this.app.use(cors());
    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }
}
