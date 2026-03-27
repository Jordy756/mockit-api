import { Router } from "express";

import type { MockController } from "../controllers/MockController.js";

export const createMockRoutes = (mockController: MockController) => {
  const router = Router();

  router.route("/:mockId").get(mockController.getAll).post(mockController.insert);

  return router;
};
