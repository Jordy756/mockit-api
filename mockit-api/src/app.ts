import { Server } from "./server.js";

const main = async () => {
  new Server({ port: 3000 }).start();
};

(() => main())();
