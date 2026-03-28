import { Router } from "express";

import type { TemplateController } from "../controllers/TemplateController.js";

export const createTemplateRoutes = (templateController: TemplateController) => {
  const router = Router();

  router.route("/").post(templateController.insert).get(templateController.getAll);

  return router;
};
