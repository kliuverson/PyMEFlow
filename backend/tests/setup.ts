import dotenv from 'dotenv';

dotenv.config({ path: '.env.test', override: true });

// Seguro anti-desastre: nunca correr tests contra la BD de desarrollo
if (!process.env.DATABASE_URL?.includes('pymeflow_test')) {
  throw new Error('DATABASE_URL no apunta a pymeflow_test');
}