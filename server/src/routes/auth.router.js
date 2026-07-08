import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validation.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { authLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

//auth rate limiter + validation for all auth routes
router.post(
    "/register",
    authLimiter,
    validateBody(registerSchema),
    authController.register
);

router.post(
    "/login",
    authLimiter,
    validateBody(loginSchema),
    authController.login
);

router.post("/logout", authController.logout);

router.get("/me", requireAuth, authController.getMe);

export default router;
