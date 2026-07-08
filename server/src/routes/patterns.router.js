import express from "express";
import * as controller from "../controllers/patterns.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", controller.createPattern);
router.get("/", controller.getPatterns);
router.get("/:id", controller.getPattern);
router.patch("/:id", controller.updatePattern);
router.delete("/:id", controller.deletePattern);

export default router;
