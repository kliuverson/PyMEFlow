
import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../config/database";
import type { LoginInput, RegisterInput } from "./auth.schemas";
import { env } from "../../config/env";

const SALT_ROUNDS = 10;

export class AuthServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "AuthServiceError";
  }
}

function generateToken(userId: string): string {
  return jwt.sign({}, env.JWT_SECRET, {
    subject: userId,
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });
}
export async function registerUser(input: RegisterInput) {
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: input.name,
          email: input.email,
          passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });

      const company = await tx.company.create({
        data: {
          name: `${input.name} - Empresa`,
          memberships: {
            create: {
              userId: user.id,
              role: "OWNER",
            },
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      return { user, company };
    });

    return {
      user: result.user,
      company: result.company,
      token: generateToken(result.user.id),
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AuthServiceError(
        "Ya existe una cuenta con ese correo electrónico",
        409,
      );
    }

    throw error;
  }
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      passwordHash: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AuthServiceError(
      "Correo electrónico o contraseña incorrectos",
      401,
    );
  }

  const passwordMatches = await bcrypt.compare(
    input.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new AuthServiceError(
      "Correo electrónico o contraseña incorrectos",
      401,
    );
  }

  const { passwordHash: _passwordHash, ...publicUser } = user;

  return {
    user: publicUser,
    token: generateToken(user.id),
  };
}
