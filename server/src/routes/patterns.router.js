import express from "express";
import * as controller from "../controllers/patterns.controller.js";

const router = express.Router();

router.post("/", controller.createPattern);
router.get("/", controller.getPatterns);
router.get("/:id", controller.getPattern);
router.patch("/:id", controller.updatePattern);
router.delete("/:id", controller.deletePattern);

export default router;
