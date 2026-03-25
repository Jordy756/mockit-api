import express, { json } from "express";

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

    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }
}
