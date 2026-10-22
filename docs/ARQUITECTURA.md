# Arquitectura técnica --- PyMEFlow

## 1. Visión general

PyMEFlow es una aplicación web de gestión para pequeñas y medianas
empresas. El sistema se organiza en frontend, backend y base de datos
relacional. La arquitectura se desarrolla por módulos y capas para
facilitar pruebas, mantenimiento y crecimiento.

``` text
Navegador
   |
   v
Frontend React + TypeScript + Vite
   |
   | HTTP / JSON
   v
API Express + TypeScript
   |
   +--> Middleware de seguridad y autenticación JWT
   |
   +--> Rutas por módulo
   |      +--> Auth
   |      +--> Companies
   |
   +--> Controladores
   |
   +--> Servicios
   |
   v
Prisma ORM 7 + adaptador PostgreSQL
   |
   v
PostgreSQL (pymeflow_db)
```

## 2. Organización del repositorio

``` text
PyMEFlow/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── generated/
│   │   │   └── prisma/
│   │   ├── middlewares/
│   │   │   └── auth.middleware.ts
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.schemas.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   └── auth.routes.ts
│   │   │   └── companies/
│   │   │       ├── companies.service.ts
│   │   │       ├── companies.controller.ts
│   │   │       └── companies.routes.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   ├── prisma.config.ts
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   └── App.css
│   └── package.json
└── docs/
```

Los archivos generados por Prisma pueden variar según la configuración
de generación. No se deben editar manualmente los archivos generados.

## 3. Capas del backend

### Configuración y acceso a datos

`src/config/database.ts` configura el adaptador `PrismaPg` y crea una
instancia de `PrismaClient`. La conexión requiere `DATABASE_URL`.

### Rutas

Las rutas definen los métodos y endpoints HTTP y conectan middleware con
controladores.

-   `auth.routes.ts`: registro, inicio de sesión y usuario actual.
-   `companies.routes.ts`: consulta de empresas del usuario.

### Middleware

`authenticateToken` lee `Authorization: Bearer <token>`, verifica el JWT
y establece el identificador del usuario para la petición. Rechaza
tokens ausentes, inválidos o expirados.

### Controladores

Los controladores interpretan la petición, validan el acceso básico,
invocan los servicios y construyen respuestas HTTP.

### Servicios

Los servicios contienen operaciones de negocio y acceso a Prisma.

-   `auth.service.ts`: registro e inicio de sesión.
-   `companies.service.ts`: consulta de empresas vinculadas al usuario.

### Validación

`auth.schemas.ts` usa Zod para validar los cuerpos de registro e inicio
de sesión y normalizar el correo.

## 4. Modelo de datos

### User

Representa una cuenta de usuario.

-   `id`: UUID.
-   `name`: nombre, máximo 100 caracteres.
-   `email`: correo único, máximo 255 caracteres.
-   `passwordHash`: hash bcrypt; se mapea a `password_hash`.
-   `createdAt`, `updatedAt`: marcas de tiempo.
-   Relación con `Membership`.

### Company

Representa una empresa.

-   `id`: UUID.
-   `name`: nombre de la empresa.
-   `taxId`: identificador tributario opcional y único.
-   `createdAt`, `updatedAt`.
-   Relación con `Membership`.

### Membership

Asocia un usuario con una empresa.

-   `id`: UUID.
-   `userId`: referencia a `User`.
-   `companyId`: referencia a `Company`.
-   `role`: enum `OWNER`, `ADMIN` o `MEMBER`.
-   `createdAt`.
-   Restricción única compuesta para evitar duplicar la membresía del
    mismo usuario en la misma empresa.
-   Índice por `companyId`.

### Relación

``` text
User 1 --- N Membership N --- 1 Company
```

Un usuario puede pertenecer a varias empresas y una empresa puede tener
varios usuarios.

## 5. Autenticación

### Registro

`POST /api/auth/register`

1.  Zod valida nombre, correo y contraseña.
2.  El correo se convierte a minúsculas.
3.  bcrypt calcula el hash con 10 rondas.
4.  Una transacción Prisma crea el usuario, una empresa inicial y su
    membresía `OWNER`.
5.  Se genera un JWT con el UUID del usuario en `sub` y duración de una
    hora.
6.  La respuesta no incluye el hash de contraseña.

El nombre inicial de la empresa es provisional y se construye a partir
del nombre del usuario. Es un pendiente funcional permitir que se envíe
el nombre de la empresa.

### Inicio de sesión

`POST /api/auth/login`

1.  Se valida el correo y la contraseña.
2.  Se busca el usuario por correo normalizado.
3.  bcrypt compara la contraseña recibida con el hash almacenado.
4.  Si las credenciales son correctas, se genera un JWT nuevo.
5.  Si el correo no existe o la contraseña no coincide, se responde con
    un mensaje genérico y HTTP 401.

### Autorización de rutas

Las rutas privadas esperan:

``` text
Authorization: Bearer <token>
```

El middleware verifica firma y expiración. Autenticación confirma la
identidad; **no basta por sí sola para autorizar acceso a datos de una
empresa**.

## 6. Aislamiento de datos por empresa

La consulta actual `GET /api/companies` filtra las membresías por
`userId` extraído del JWT. Las operaciones futuras de inventario,
ventas, clientes y productos deben comprobar además que el usuario tenga
una membresía válida para la empresa solicitada.

Reglas recomendadas: - No confiar en un `userId` enviado por el cliente
para determinar la identidad. - Verificar en backend que el usuario
pertenece a la empresa de la operación. - Verificar permisos según
`OWNER`, `ADMIN` y `MEMBER` cuando existan operaciones restringidas. -
Incluir el identificador de empresa en el ámbito de cada consulta de
negocio. - No devolver registros de otra empresa aunque el cliente
cambie un UUID. - Probar expresamente intentos de acceso cruzado entre
empresas.

## 7. Endpoints existentes

  --------------------------------------------------------------------------------
  Método            Ruta                   Middleware            Función
  ----------------- ---------------------- --------------------- -----------------
  GET               `/`                    ---                   Bienvenida

  GET               `/health`              ---                   Estado de la API

  POST              `/api/auth/register`   ---                   Registro

  POST              `/api/auth/login`      ---                   Inicio de sesión

  GET               `/api/auth/me`         `authenticateToken`   Datos del usuario
                                                                 autenticado

  GET               `/api/companies`       `authenticateToken`   Empresas del
                                                                 usuario
  --------------------------------------------------------------------------------

## 8. Seguridad actual y mejoras pendientes

Implementado: - Helmet. - CORS configurado con `FRONTEND_URL`. - Límite
de JSON de 1 MB. - `X-Powered-By` deshabilitado. - bcrypt para hashes de
contraseña. - JWT con expiración. - Validación Zod para autenticación. -
Respuesta genérica para credenciales incorrectas. - Selección explícita
de campos públicos en consultas de usuario. - Rutas privadas protegidas
por middleware.

Pendiente: - Centralizar validación de variables de entorno al
arrancar. - Definir política de rotación y almacenamiento de secretos en
producción. - Añadir rate limiting para registro e inicio de sesión. -
Añadir pruebas automatizadas unitarias y de integración. - Añadir
estrategia de revocación/renovación de tokens si el producto lo
requiere. - Normalizar el tipado de `req.user` en Express. - Definir
controles por rol para las operaciones de negocio. - Documentar y probar
errores y límites de cada endpoint.

## 9. Frontend

El frontend se creó con React, TypeScript y Vite. Tiene una interfaz de
dashboard con tema oscuro y acentos verdes, navegación por módulos,
indicadores y datos de demostración. Algunos módulos muestran marcadores
de posición.

El frontend todavía debe conectarse con los endpoints reales,
implementar formularios de autenticación y reemplazar datos ficticios
por información de la API.

## 10. Migraciones y desarrollo

Prisma 7 utiliza `backend/prisma/schema.prisma` para el esquema y
`backend/prisma.config.ts` para la configuración de migraciones y URL de
la base de datos. La migración inicial registrada se llama
`20261021163651_init`.

Antes de ejecutar cambios de esquema: 1. Modificar el esquema Prisma. 2.
Revisar el diff. 3. Crear una migración con un nombre descriptivo. 4.
Generar el cliente según la configuración del proyecto. 5. Compilar y
probar los endpoints afectados. 6. Versionar esquema y migraciones, sin
publicar secretos.

## 11. Principios de implementación

-   Mantener módulos separados por dominio.
-   Separar rutas, controladores, servicios y esquemas.
-   Mantener respuestas HTTP consistentes.
-   Validar los datos de entrada en backend.
-   Usar transacciones cuando una operación cree entidades relacionadas.
-   No exponer hashes, secretos ni detalles internos de errores.
-   Asegurar aislamiento multiempresa en cada consulta y mutación.
-   Mantener documentación y bitácora actualizadas en cada hito.
