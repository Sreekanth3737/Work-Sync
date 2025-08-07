import express from "express";
import { validateRequest } from "zod-express-middleware";
import authMiddleware from "../middleware/auth-middleware.js";
import { projectSchema } from "../libs/validate-schema.js";
import { z } from "zod";
import {
  createProject,
  getProjectWithTasks,
} from "../controllers/projectController.js";

const router = express.Router();

router.post(
  "/:workspaceId/create-project",
  authMiddleware,
  validateRequest({
    params: z.object({
      workspaceId: z.string(),
    }),
    body: projectSchema,
  }),
  createProject
);

router.get(
  "/:projectId/tasks",
  authMiddleware,
  validateRequest({
    params: z.object({
      projectId: z.string(),
    }),
  }),
  getProjectWithTasks
);

export default router;
