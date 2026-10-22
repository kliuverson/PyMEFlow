
import type { Request, Response } from "express";
import { ZodError } from "zod";
import {
  AuthServiceError,
  loginUser,
  registerUser,
} from "./auth.service";
import { loginSchema, registerSchema } from "./auth.schemas";
import { prisma } from "../../config/database";

export async function register(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const input = registerSchema.parse(req.body);
    const result = await registerUser(input);

    res.status(201).json({
      success: true,
      message: "Cuenta creada correctamente",
      data: result,
    });
  } catch (error) {
    handleAuthError(error, res);
  }
}

export async function login(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const input = loginSchema.parse(req.body);
    const result = await loginUser(input);

    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      data: result,
    });
  } catch (error) {
    handleAuthError(error, res);
  }
}

function handleAuthError(error: unknown, res: Response): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Los datos enviados no son válidos",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof AuthServiceError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  console.error("Error en autenticación:", error);

  res.status(500).json({
    success: false,
    message: "Ocurrió un error interno del servidor",
  });
}

export async function getCurrentUser(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = (req as Request & { userId?: string }).userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Usuario no autenticado",
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        memberships: {
          select: {
            role: true,
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "El usuario ya no existe",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("Error al obtener el usuario autenticado:", error);

    res.status(500).json({
      success: false,
      message: "Ocurrió un error interno del servidor",
    });
  }
}
