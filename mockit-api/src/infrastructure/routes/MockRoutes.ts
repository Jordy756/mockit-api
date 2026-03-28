import { Router } from "express";

import { MockController } from "../controllers/MockController.js";

export const createMockRoutes = (mockController: MockController) => {
  const router = Router();

  router.route("/:id")
    .post(mockController.insert)
    .get(mockController.getAll);

  return router;
};
