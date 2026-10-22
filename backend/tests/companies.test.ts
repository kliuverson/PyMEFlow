import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import app from '../src/app';
import { prisma } from '../src/config/database';
import { resetDb, tokenOf } from './helpers';

const pw = 'UnaClaveDePruebaSegura2026!';
const register = (name: string, email: string) =>
  request(app).post('/api/auth/register').send({ name, email, password: pw });

beforeEach(resetDb);
afterAll(() => prisma.$disconnect());

describe('GET /api/companies', () => {
  it('401 sin token', async () => {
    expect((await request(app).get('/api/companies')).status).toBe(401);
  });

  it('devuelve la empresa del usuario con rol OWNER', async () => {
    const a = await register('Ana', 'ana@example.com');
    const res = await request(app)
      .get('/api/companies')
      .set('Authorization', `Bearer ${tokenOf(a)}`);
    expect(res.status).toBe(200);
    expect(res.body.data.total).toBe(1);
    expect(res.body.data.companies[0].role).toBe('OWNER');
  });

  it('aislamiento: un usuario no ve las empresas de otro', async () => {
    const a = await register('Ana', 'ana@example.com');
    const b = await register('Beto', 'beto@example.com');
    const res = await request(app)
      .get('/api/companies')
      .set('Authorization', `Bearer ${tokenOf(a)}`);
    expect(res.body.data.companies).toHaveLength(1);
    expect(res.body.data.companies[0].id).toBe(a.body.data.company.id);
    expect(res.body.data.companies[0].id).not.toBe(b.body.data.company.id);
  });
});