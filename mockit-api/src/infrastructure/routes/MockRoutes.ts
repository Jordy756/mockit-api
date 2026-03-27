import { Router } from "express";

import type { MockController } from "../controllers/MockController.js";

export const createMockRoutes = (mockController: MockController) => {
  const router = Router();

  router.post("/", mockController.insert);
  router.get("/", mockController.getAll);

  return router;
};
