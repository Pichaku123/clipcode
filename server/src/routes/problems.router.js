import express from "express";
import * as controller from "../controllers/problems.controller.js";

const router = express.Router();

router.post("/", controller.createProblem);
router.get("/", controller.getProblems);
router.get("/:id", controller.getProblem);
router.patch("/:id", controller.updateProblem);
router.delete("/:id", controller.deleteProblem);

export default router;
