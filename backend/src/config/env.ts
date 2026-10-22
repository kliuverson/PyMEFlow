import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  DATABASE_URL: z
    .string()
    .regex(/^postgres(ql)?:\/\//, "debe ser una URL de PostgreSQL"),
  JWT_SECRET: z.string().min(32, "debe tener al menos 32 caracteres"),
  JWT_EXPIRES_IN: z
    .string()
    .regex(/^\d+[smhd]$/, "formato esperado: 30m, 1h, 7d")
    .default("1h"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Solo se muestran nombres y motivos, nunca los valores (pueden ser secretos)
  const details = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`Configuración de entorno inválida:\n${details}`);
}

export const env = parsed.data;