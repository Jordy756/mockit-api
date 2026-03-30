import { Router } from "express";

import { MockController } from "../controllers/MockController.js";

export const createMockRoutes = (mockController: MockController) => {
  const router = Router();

  router
    .route("/:mockId")
    .post(mockController.insert)
    .get(mockController.getAll);

  router
    .route("/:mockId/:id")
    .put(mockController.update)
    .patch(mockController.patch)
    .delete(mockController.delete);

  return router;
};
