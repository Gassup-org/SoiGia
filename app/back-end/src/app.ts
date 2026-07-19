import express from "express";
import cors from "cors";
import config from "./config/app.config.ts";
import morgan from "morgan";
import bodyParser from "body-parser";

const app = express();

app.use(cors(config.corsOptions));

app.use(morgan("dev"));

app.use(bodyParser.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString()
  })
});


export default app;
