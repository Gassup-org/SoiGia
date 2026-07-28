import express from "express";
import cors from "cors";
import config from "./config/app.config.ts";
import morgan from "morgan";
import { responseHandler } from "./middlewares/rest.response.ts";
import { errorHandler } from "./middlewares/error.handler.ts";

const app = express();

app.use(cors(config.corsOptions));

app.use(morgan("dev"));

app.use(express.json());

app.use(responseHandler);

app.get("/health", (_req, res) => {
  return res.ok("Server is running", {status: "ok"});
});

// === API ở đây ====

// ==================

app.use((_req, res) => {
  res.notFound("Route not found");
});

app.use(errorHandler);

export default app;
