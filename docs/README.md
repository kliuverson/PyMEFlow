# PyMEFlow

Sistema web de gestión para pequeñas y medianas empresas (PyMEs),
desarrollado como proyecto de portafolio con potencial de convertirse en
un producto comercial.

## Estado actual

**Etapa:** base del proyecto, autenticación y consulta de empresas.

Implementado y probado hasta ahora: - Backend con Node.js, Express y
TypeScript. - Frontend con React, TypeScript y Vite. - PostgreSQL
conectado mediante Prisma ORM 7. - Modelos iniciales de usuario, empresa
y membresía. - Registro de usuarios con contraseña cifrada mediante
bcrypt. - Inicio de sesión con JWT de una hora. - Validación de entradas
con Zod. - Middleware para proteger rutas con JWT. - Endpoint para
consultar el usuario autenticado. - Endpoint protegido para consultar
las empresas a las que pertenece el usuario. - Compilación del backend y
del frontend comprobada durante el desarrollo. - Cambios de
autenticación y empresas publicados en GitHub.

## Tecnologías

### Backend

-   Node.js
-   Express 5
-   TypeScript
-   Prisma ORM 7
-   PostgreSQL
-   Zod
-   bcrypt
-   jsonwebtoken
-   Helmet
-   CORS

### Frontend

-   React
-   TypeScript
-   Vite
-   Interfaz inicial tipo dashboard con tema oscuro y acentos verdes.

## Estructura general

``` text
PyMEFlow/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── generated/
│   │   ├── middlewares/
│   │   └── modules/
│   │       ├── auth/
│   │       └── companies/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
└── docs/
    ├── ARQUITECTURA.md
    └── BITACORA.md
```

La estructura exacta puede crecer a medida que se incorporen módulos.

## Requisitos locales

-   Node.js y npm.
-   PostgreSQL.
-   Git.
-   Un editor como Visual Studio Code.

Las versiones instaladas durante el desarrollo incluyen Node.js
`v24.13.0`, PostgreSQL `18.6`, Prisma `7.10.1` y Vite `8.3.4`. Pueden
cambiar conforme evolucione el proyecto.

## Configuración local

1.  Clonar el repositorio:

    ``` powershell
    git clone https://github.com/kliuverson/PyMEFlow.git
    cd PyMEFlow
    ```

2.  Instalar dependencias del backend:

    ``` powershell
    cd backend
    npm install
    ```

3.  Crear el archivo local de variables de entorno a partir del ejemplo:

    ``` powershell
    Copy-Item .env.example .env
    ```

4.  Configurar en `backend/.env` los valores locales requeridos:

    -   `PORT`
    -   `NODE_ENV`
    -   `FRONTEND_URL`
    -   `DATABASE_URL`
    -   `JWT_SECRET`
    -   `JWT_EXPIRES_IN`

    `DATABASE_URL` debe apuntar a la base PostgreSQL local. `JWT_SECRET`
    debe ser un valor aleatorio fuerte. **No publicar el archivo `.env`
    ni compartir sus valores.**

5.  Ejecutar las migraciones y generar el cliente de Prisma, siguiendo
    los comandos compatibles con la configuración Prisma 7 del
    repositorio. Antes de ejecutar una migración en un entorno
    existente, revisar primero el estado de la base de datos.

6.  Iniciar el backend:

    ``` powershell
    npm run dev
    ```

7.  En otra terminal, instalar e iniciar el frontend:

    ``` powershell
    cd ..\frontend
    npm install
    npm run dev
    ```

Los comandos de base de datos pueden depender de la configuración local
y del estado de las migraciones. Consultar `backend/prisma.config.ts` y
`backend/package.json` antes de ejecutarlos.

## API disponible

Base local: `http://localhost:3000`

  ----------------------------------------------------------------------------
  Método            Endpoint               Autenticación     Propósito
  ----------------- ---------------------- ----------------- -----------------
  GET               `/`                    No                Mensaje de
                                                             bienvenida de la
                                                             API

  GET               `/health`              No                Verificar
                                                             disponibilidad de
                                                             la API

  POST              `/api/auth/register`   No                Registrar usuario
                                                             y crear empresa
                                                             inicial

  POST              `/api/auth/login`      No                Iniciar sesión y
                                                             recibir JWT

  GET               `/api/auth/me`         Bearer JWT        Obtener datos del
                                                             usuario
                                                             autenticado y sus
                                                             membresías

  GET               `/api/companies`       Bearer JWT        Listar las
                                                             empresas a las
                                                             que pertenece el
                                                             usuario
  ----------------------------------------------------------------------------

### Registro

`POST /api/auth/register`

Ejemplo de cuerpo:

``` json
{
  "name": "Usuario Prueba",
  "email": "prueba@example.com",
  "password": "UnaClaveDePruebaSegura2026!"
}
```

Las reglas actuales validan un nombre de 2 a 100 caracteres, correo
válido de hasta 255 caracteres y contraseña de 12 a 64 caracteres. El
correo se normaliza a minúsculas. El registro crea una empresa inicial
cuyo nombre provisional se deriva del nombre del usuario y una membresía
`OWNER`.

### Inicio de sesión

`POST /api/auth/login`

``` json
{
  "email": "prueba@example.com",
  "password": "UnaClaveDePruebaSegura2026!"
}
```

La respuesta exitosa incluye datos públicos del usuario y un token JWT.
Enviar el token a las rutas protegidas con:

``` text
Authorization: Bearer <token>
```

### Códigos de respuesta esperados

-   `201`: registro correcto.
-   `200`: inicio de sesión o consulta correcta.
-   `400`: datos inválidos.
-   `401`: credenciales incorrectas, token ausente, inválido o expirado.
-   `409`: correo ya registrado.
-   `500`: error interno inesperado.

## Modelo de datos actual

-   **User:** usuario, correo único y hash de contraseña.
-   **Company:** empresa y `taxId` opcional único.
-   **Membership:** relación entre usuario y empresa, con rol `OWNER`,
    `ADMIN` o `MEMBER`.

La relación usuario-empresa permite que un usuario pertenezca a varias
empresas. Las futuras consultas y operaciones de negocio deben filtrar
por la empresa autorizada y verificar membresía en el backend; no se
debe confiar en identificadores enviados por el frontend sin
autorización del servidor.

## Seguridad y buenas prácticas

-   No versionar `backend/.env`.
-   No incluir tokens ni contraseñas en capturas, commits o
    documentación.
-   Guardar contraseñas usando bcrypt, nunca en texto plano.
-   Usar JWT en la cabecera `Authorization`.
-   Validar las entradas del cliente.
-   Mantener protegidas las rutas privadas.
-   Verificar la membresía y los permisos en cada operación sobre datos
    de empresa.
-   Usar secretos distintos y configuración segura fuera del entorno
    local.
-   Revisar los cambios staged antes de cada commit.

## Desarrollo y Git

Flujo recomendado:

1.  Implementar una parte pequeña.
2.  Compilar.
3.  Probar comportamiento correcto y errores esperados.
4.  Revisar `git status` y `git diff --cached`.
5.  Crear un commit descriptivo.
6.  Subir a `main` cuando las pruebas pasen.

Ejemplos de comandos:

``` powershell
git status
git add <archivos>
git diff --cached --name-only
git diff --cached
git commit -m "feat(modulo): describe el cambio"
git push origin main
```

Repositorio: https://github.com/kliuverson/PyMEFlow

## Documentación del proyecto

-   [Bitácora de desarrollo](docs/BITACORA.md)
-   [Arquitectura y decisiones técnicas](docs/ARQUITECTURA.md)

## Pendientes principales

-   Revisar y fortalecer la gestión de errores y configuración.
-   Definir cómo se establece el nombre real de la empresa durante el
    registro.
-   Añadir pruebas automatizadas.
-   Crear operaciones de empresas con autorización explícita.
-   Implementar productos e inventario con aislamiento por empresa.
-   Conectar el frontend con la API y reemplazar los datos de
    demostración.
-   Añadir documentación de API más completa y estrategia de despliegue.
