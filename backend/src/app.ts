

const app = express();
import authRouter from "./modules/auth/auth.routes";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import companiesRouter from "./modules/companies/companies.routes";
app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use("/api/auth", authRouter);
app.use("/api/companies", companiesRouter);

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Bienvenido a la API de PyMEFlow",
    documentation: "/health",
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "PyMEFlow API funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
});

export default app;
