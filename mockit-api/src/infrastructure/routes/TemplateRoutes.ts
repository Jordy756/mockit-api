import { Router } from "express";

import type { MockRecordController } from "../controllers/MockRecordController.js";

export const createTemplateRoutes = (templateController: MockRecordController) => {
  const router = Router();

  router.route("/").post(templateController.insert).get(templateController.getAll);

  return router;
};
