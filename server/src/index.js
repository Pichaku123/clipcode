import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.router.js";
import patternsRouter from "./routes/patterns.router.js";
import snippetsRouter from "./routes/snippets.router.js";
import problemsRouter from "./routes/problems.router.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/patterns", patternsRouter);
app.use("/api/snippets", snippetsRouter);
app.use("/api/problems", problemsRouter);

app.use(errorHandler);

export default app;
