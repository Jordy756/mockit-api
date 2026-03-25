import { Server } from "./server.js";

const main = async () => {
  new Server().start(3000);
  console.log("Starting Mockit API...");
  // const { app } = await import("./app.ts");
  // const PORT = process.env.PORT ?? 3000;

  // app.listen(PORT, () => {
  //   console.log(`Listening on http://localhost:${PORT}`);
  // });
};

(() => main())();
