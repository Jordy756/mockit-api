
import express from "express";

export class Server {
  private readonly app = express();

  constructor() {}

  public start(port: number) {
    this.app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  }
}
