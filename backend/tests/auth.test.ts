import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import app from '../src/app';
import { prisma } from '../src/config/database';
import { resetDb, tokenOf } from './helpers';
const user = {
  name: 'Usuario Prueba',
  email: 'prueba@example.com',
  password: 'UnaClaveDePruebaSegura2026!',
};

beforeEach(resetDb);
afterAll(() => prisma.$disconnect());

describe('POST /api/auth/register', () => {
  it('registra, devuelve 201 y no expone el hash', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(201);
    expect(JSON.stringify(res.body)).not.toMatch(/passwordHash|password_hash/);
  });

  it('crea empresa inicial y membresía OWNER', async () => {
    await request(app).post('/api/auth/register').send(user);
    const m = await prisma.membership.findFirstOrThrow();
    expect(m.role).toBe('OWNER');
  });

  it('409 con correo duplicado', async () => {
    await request(app).post('/api/auth/register').send(user);
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(409);
  });

  it('400 con contraseña de menos de 12 caracteres', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...user, password: 'corta' });
    expect(res.status).toBe(400);
  });

  it('normaliza el correo a minúsculas', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ ...user, email: 'PRUEBA@Example.com' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: user.password });
    expect(res.status).toBe(200);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(user);
  });

  it('200 con token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: user.password });
    expect(res.status).toBe(200);
    expect(tokenOf(res)).toBeTruthy();
  });

  it('401 con contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: 'OtraClaveIncorrecta123!' });
    expect(res.status).toBe(401);
  });

  it('401 con correo inexistente (mismo mensaje que clave mala)', async () => {
    const bad = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: 'OtraClaveIncorrecta123!' });
    const none = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nadie@example.com', password: user.password });
    expect(none.status).toBe(401);
    expect(none.body).toEqual(bad.body);
  });
});

describe('GET /api/auth/me', () => {
  it('401 sin token', async () => {
    expect((await request(app).get('/api/auth/me')).status).toBe(401);
  });

  it('401 con token inválido', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer token.invalido.x');
    expect(res.status).toBe(401);
  });

  it('200 con token válido', async () => {
    const reg = await request(app).post('/api/auth/register').send(user);
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${tokenOf(reg)}`);
    expect(res.status).toBe(200);
  });
});