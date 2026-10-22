
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Debes iniciar sesión para acceder a este recurso",
    });
    return;
  }

  const token = authorization.slice(7);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    res.status(500).json({
      success: false,
      message: "La autenticación no está configurada correctamente",
    });
    return;
  }

  try {
    const payload = jwt.verify(token, secret);

    if (
      typeof payload === "string" ||
      typeof payload.sub !== "string"
    ) {
      res.status(401).json({
        success: false,
        message: "El token no es válido",
      });
      return;
    }

    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "El token es inválido o ha expirado",
    });
  }
}
