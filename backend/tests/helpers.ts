import { prisma } from '../src/config/database';
import type { Response } from 'supertest';

export const tokenOf = (res: Response): string => res.body.data.token;
export async function resetDb() {
  await prisma.membership.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();
}