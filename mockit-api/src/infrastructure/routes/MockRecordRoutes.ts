import { Router } from "express";

import type { MockRecordController } from "../controllers/MockRecordController.js";

export const createMockRecordRoutes = (mockRecordController: MockRecordController) => {
  const router = Router();

  router.route("/").post(mockRecordController.insert).get(mockRecordController.getAll);

  return router;
};
