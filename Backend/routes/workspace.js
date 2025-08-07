import express from "express";
import { validateRequest } from "zod-express-middleware";
import { workspaceSchema } from "../libs/validate-schema.js";
import authMiddleware from "../middleware/auth-middleware.js";
import {
  createWorkspace,
  getWorkspaceByID,
  getWorkspaceProjects,
  getWorkspaces,
  getWorkspaceStats,
  inviteMember,
  acceptInviteByToken,
  acceptGenerateInvite,
  removeMember,
  updateMemberRole,
} from "../controllers/workspaceController.js";
import { z } from "zod";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateRequest({ body: workspaceSchema }),
  createWorkspace
);

router.get("/", authMiddleware, getWorkspaces);

router.get("/:workspaceId", authMiddleware, getWorkspaceByID);
router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProjects);
router.get("/:workspaceId/stats", authMiddleware, getWorkspaceStats);

router.post(
  "/:workspaceId/invite-member",
  authMiddleware,
  validateRequest({
    params: z.object({ workspaceId: z.string() }),
    body: z.object({
      email: z.string().email(),
      role: z.enum(["admin", "member", "owner", "viewer"]),
    }),
  }),
  inviteMember
);

router.delete(
  "/:workspaceId/members/:memberId",
  authMiddleware,
  validateRequest({
    params: z.object({
      workspaceId: z.string(),
      memberId: z.string(),
    }),
  }),
  removeMember
);

router.put(
  "/:workspaceId/members/:memberId/role",
  authMiddleware,
  validateRequest({
    params: z.object({
      workspaceId: z.string(),
      memberId: z.string(),
    }),
    body: z.object({
      role: z.enum(["admin", "member", "owner", "viewer"]),
    }),
  }),
  updateMemberRole
);

router.post(
  "/accept-invite-token",
  authMiddleware,
  validateRequest({
    body: z.object({ token: z.string() }),
  }),
  acceptInviteByToken
);

router.post(
  "/:workspaceId/accept-generate-invite",
  authMiddleware,
  validateRequest({
    params: z.object({ workspaceId: z.string() }),
  }),
  acceptGenerateInvite
);

export default router;
