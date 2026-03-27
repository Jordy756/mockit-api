import { Router } from "express";

import type { TemplateController } from "../controllers/TemplateController.js";

export const createTemplateRoutes = (mockController: TemplateController) => {
  const router = Router();

  router.post("/", mockController.insert);
  router.get("/", mockController.getAll);

  return router;
};
