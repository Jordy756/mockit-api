import { Router } from "express";

import type { MockController } from "../controllers/MockController.js";

export const createMockRuntimeRoutes = (mockRuntimeController: MockController) => {
  const router = Router();

  router.route("/:mockId").get(mockRuntimeController.getAll).post(mockRuntimeController.insert);

  return router;
};
