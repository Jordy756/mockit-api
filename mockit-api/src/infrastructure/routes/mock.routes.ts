import { Router } from "express";

import type { MockController } from "../controllers/mock.controller.js";

export const createMockRoutes = (mockController: MockController) => {
  const router = Router();

  router.post("/register", mockController.register);

  return router;
};
