import { Router } from "express";

import { MockController } from "../controllers/MockController.js";

export const createMockRoutes = (mockController: MockController) => {
  const router = Router({ mergeParams: true });

  router.route("/").post(mockController.insert).get(mockController.getAll);
  router
    .route("/:mockId")
    .put(mockController.update)
    .patch(mockController.patch)
    .delete(mockController.delete)
    .get(mockController.getById);

  return router;
};
