import { Router } from "express";

import type { MockController } from "../controllers/MockController.js";

export const createMockRoutes = (mockController: MockController) => {
  const router = Router();

  router.route("/:templateId").get(mockController.getAll).post(mockController.insert);

  return router;
};
