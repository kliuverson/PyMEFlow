
import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),

  email: z
    .string()
    .trim()
    .email("Ingresa un correo electrónico válido")
    .max(255, "El correo no puede superar los 255 caracteres")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(12, "La contraseña debe tener al menos 12 caracteres")
    .max(64, "La contraseña no puede superar los 64 caracteres"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Ingresa un correo electrónico válido")
    .max(255, "El correo no puede superar los 255 caracteres")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .max(64, "La contraseña no puede superar los 64 caracteres"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
