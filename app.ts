import { Server } from "./src/infrastructure/api/server.js";

const main = async () => {
  new Server({ port: 3000 }).start();
};

(() => main())();
