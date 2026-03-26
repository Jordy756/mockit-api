import { Router } from "express";

import type { MockController } from "../controllers/MockController.js";

export const createMockRoutes = (mockController: MockController) => {
  const router = Router();

  router.post("/", mockController.register);
  router.get("/", (req, res) => mockController.list(req, res));

  return router;
};
