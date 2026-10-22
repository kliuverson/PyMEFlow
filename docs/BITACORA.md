# Bitácora de desarrollo --- PyMEFlow

Este documento registra los avances realizados hasta el 22 de octubre de
2026. Refleja lo implementado y probado durante el desarrollo; los
módulos pendientes no se consideran terminados.

## Datos generales

-   **Proyecto:** PyMEFlow
-   **Objetivo:** sistema web genérico de gestión para PyMEs, con
    propósito de portafolio y potencial comercial.
-   **Repositorio:** https://github.com/kliuverson/PyMEFlow
-   **Ubicación local:** `D:\Desktop\pymeflow`
-   **Rama de trabajo:** `main`
-   **Frontend:** React + TypeScript + Vite
-   **Backend:** Node.js + Express + TypeScript
-   **Base de datos:** PostgreSQL con Prisma ORM 7

## Registro de avances

### 1. Inicialización del proyecto

**Resultado:** completado.

-   Se organizó el proyecto con carpetas independientes para `backend`,
    `frontend` y `docs`.
-   Se creó el frontend con Vite y la plantilla React + TypeScript.
-   Se configuró el backend con Express y TypeScript.
-   Se definieron scripts de desarrollo, compilación y ejecución.
-   Se configuró Git y se sincronizó la rama local `main` con el
    repositorio remoto.

### 2. Base de datos y Prisma

**Resultado:** conexión y esquema inicial comprobados.

-   Se instaló PostgreSQL localmente y se creó la base de datos
    `pymeflow_db`.
-   Se configuró Prisma 7 con el proveedor PostgreSQL y la configuración
    externa de Prisma.
-   Se configuró el adaptador PostgreSQL para Prisma Client.
-   Se definieron los modelos `User`, `Company` y `Membership`, además
    del enum `MembershipRole`.
-   Se creó la migración inicial `20261021163651_init`.
-   Se validó el esquema y se comprobó la conexión a la base de datos.
-   Se generó el cliente Prisma en `backend/src/generated/prisma`.

### 3. API base

**Resultado:** implementado y probado manualmente.

-   Se configuraron Express, CORS y Helmet.
-   Se limitó el tamaño del JSON de entrada a 1 MB.
-   Se deshabilitó el encabezado `X-Powered-By`.
-   Se creó `GET /` como mensaje de bienvenida.
-   Se creó `GET /health` para comprobar el estado de la API.
-   Se comprobó el funcionamiento local en `http://localhost:3000`.

### 4. Interfaz inicial

**Resultado:** interfaz de demostración implementada.

-   Se creó el frontend React + TypeScript.
-   Se preparó un dashboard con tema oscuro y acentos verdes.
-   Se añadieron tarjetas de indicadores, visualizaciones de ejemplo,
    navegación y una tabla de ventas recientes.
-   Se habilitó una búsqueda local sobre los datos de demostración.
-   La compilación de producción del frontend fue comprobada.
-   **Nota:** los indicadores y las ventas mostradas son datos de
    demostración; todavía no representan datos reales obtenidos desde la
    API.

### 5. Autenticación

**Resultado:** implementada y probada manualmente.

Archivos principales: - `backend/src/modules/auth/auth.schemas.ts` -
`backend/src/modules/auth/auth.service.ts` -
`backend/src/modules/auth/auth.controller.ts` -
`backend/src/modules/auth/auth.routes.ts` -
`backend/src/middlewares/auth.middleware.ts`

Trabajo realizado: - Se instalaron `bcrypt`, `jsonwebtoken` y sus tipos
de TypeScript. - Se validaron nombre, correo y contraseña mediante
Zod. - Se normaliza el correo a minúsculas. - La contraseña de registro
debe tener entre 12 y 64 caracteres. - Se cifran las contraseñas con
bcrypt usando `SALT_ROUNDS = 10`. - Se genera un JWT con duración de una
hora y el identificador de usuario en `sub`. - Se creó
`POST /api/auth/register`. - Se creó `POST /api/auth/login`. - Se creó
`GET /api/auth/me`, protegido por JWT. - Se implementó respuesta `409`
para correo duplicado y `401` para credenciales incorrectas. - Se probó
registro, inicio de sesión, contraseña incorrecta, endpoint privado sin
token, token válido y token inválido. - Las pruebas manuales reportadas
dieron los resultados esperados. - Se añadieron `JWT_SECRET` y
`JWT_EXPIRES_IN=1h` a la configuración de ejemplo. El secreto real se
conserva solo en el `.env` local, que no debe versionarse.

**Commit publicado:**
`ab8181c feat(auth): implement JWT authentication`.

### 6. Módulo de empresas

**Resultado:** consulta de empresas implementada y probada manualmente.

Archivos principales: -
`backend/src/modules/companies/companies.service.ts` -
`backend/src/modules/companies/companies.controller.ts` -
`backend/src/modules/companies/companies.routes.ts` - Registro de las
rutas en `backend/src/app.ts`

Trabajo realizado: - Se creó el servicio `getUserCompanies`, que busca
las membresías filtradas por el identificador del usuario autenticado. -
Se devuelve la información básica de la empresa junto con el rol del
usuario y la fecha de vinculación. - Se creó el controlador
`listMyCompanies`. - Se registró `GET /api/companies` protegido por el
middleware JWT. - Se probó el endpoint sin token y se obtuvo `401`. - Se
probó con un token válido y se obtuvo la empresa inicial del usuario con
el rol `OWNER`. - Las pruebas manuales reportadas dieron los resultados
esperados.

**Commit publicado:**
`5c1f5d8 feat(companies): add authenticated company listing`.

## Historial Git conocido

  ------------------------------------------------------------------------------------------
  Commit                              Descripción
  ----------------------------------- ------------------------------------------------------
  `92f3067`                           `chore: initialize PyMEFlow monorepo` --- commit
                                      inicial local

  `ab8181c`                           `feat(auth): implement JWT authentication`

  `5c1f5d8`                           `feat(companies): add authenticated company listing`
  ------------------------------------------------------------------------------------------

El repositorio remoto se sincronizó con la rama `main`; el último
`git push` reportado publicó el commit `5c1f5d8`.

## Estado de compilación y pruebas

  -----------------------------------------------------------------------
  Área                                Estado registrado
  ----------------------------------- -----------------------------------
  Backend TypeScript                  `npm run build` compila sin errores
                                      tras autenticación y empresas

  Frontend                            Compilación Vite comprobada
                                      previamente

  PostgreSQL / Prisma                 Conexión comprobada y migración
                                      inicial aplicada

  Registro                            Prueba manual exitosa

  Inicio de sesión                    Prueba manual exitosa

  Rechazo de contraseña incorrecta    HTTP 401 esperado

  `/api/auth/me` sin token            HTTP 401 esperado

  `/api/auth/me` con token válido     Consulta exitosa

  `/api/auth/me` con token inválido   HTTP 401 esperado

  `/api/companies` sin token          HTTP 401 esperado

  `/api/companies` con token válido   Consulta exitosa
  -----------------------------------------------------------------------

Estas son pruebas manuales realizadas durante el desarrollo, no una
suite automatizada.

## Decisiones técnicas actuales

-   La API usa Express y TypeScript.
-   PostgreSQL es la base de datos.
-   Prisma 7 administra el esquema y las migraciones.
-   Zod valida los cuerpos de registro e inicio de sesión.
-   bcrypt se usa con 10 rondas para almacenar hashes de contraseña.
-   Los JWT duran una hora.
-   El registro crea al usuario, una empresa inicial y una membresía
    `OWNER` dentro de una transacción.
-   El nombre de la empresa inicial se genera provisionalmente como
    `<nombre del usuario> - Empresa`.
-   La aplicación permite la relación muchos-a-muchos entre usuarios y
    empresas mediante `Membership`.
-   El frontend es React + TypeScript y tiene una interfaz inicial de
    demostración.
-   El desarrollo se realiza en Windows y el proyecto está ubicado en
    `D:\Desktop\pymeflow`.

## Pendientes antes de ampliar el sistema

1.  Confirmar que el árbol de trabajo local esté limpio y que la
    documentación se suba a GitHub.
2.  Añadir pruebas automatizadas para autenticación y empresas.
3.  Incorporar configuración y validación centralizadas de variables de
    entorno.
4.  Mejorar el tipado de la identidad autenticada de Express para no
    duplicar interfaces en cada controlador.
5.  Definir un flujo para establecer el nombre legal/comercial de la
    empresa durante el registro.
6.  Diseñar permisos y aislamiento por empresa para todas las
    operaciones de negocio.
7.  Implementar productos e inventario.
8.  Conectar el frontend a la API y reemplazar los datos ficticios por
    datos reales.
9.  Añadir documentación más completa de endpoints y despliegue.

## Flujo de trabajo acordado

Para cada avance importante:

1.  Implementar una parte pequeña.
2.  Ejecutar la compilación.
3.  Probar el comportamiento esperado y los errores.
4.  Revisar los archivos preparados con `git diff --cached`.
5.  Crear un commit descriptivo.
6.  Subir los cambios a GitHub.
