
import type { Request, Response } from "express";
import { getUserCompanies } from "./companies.service";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export async function listMyCompanies(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Debes iniciar sesión para consultar tus empresas",
    });
    return;
  }

  try {
    const companies = await getUserCompanies(userId);

    res.status(200).json({
      success: true,
      data: {
        companies,
        total: companies.length,
      },
    });
  } catch (error) {
    console.error("Error al consultar las empresas:", error);

    res.status(500).json({
      success: false,
      message: "No fue posible consultar las empresas",
    });
  }
}
