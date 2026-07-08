import express from "express";
import * as controller from "../controllers/snippets.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", controller.createSnippet);
router.get("/", controller.getSnippets);
router.get("/:id", controller.getSnippet);
router.patch("/:id", controller.updateSnippet);
router.delete("/:id", controller.deleteSnippet);

export default router;
