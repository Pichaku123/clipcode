import "dotenv/config";
import express from "express";
import cors from "cors";
import patternsRouter from "./routes/patterns.router.js";
import snippetsRouter from "./routes/snippets.router.js";
import problemsRouter from "./routes/problems.router.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/patterns", patternsRouter);
app.use("/api/snippets", snippetsRouter);
app.use("/api/problems", problemsRouter);

app.use(errorHandler);

export default app;
