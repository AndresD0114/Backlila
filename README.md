# LILA Backend

Node.js 22 o superior, npm y MySQL. Monorepo con dos procesos independientes:
Gateway (3000) y Casos (3001). Cada API tiene sus propios paquetes npm.

## Organización

```text
APIs/
  Cases/
    api/                                  @lila/cases-api
    1.middleware/cases-middleware/        @lila/cases-middleware
      src/Controllers/
      src/Routers/
      src/Swagger/
    2.business/cases-business/            @lila/cases-business
      src/Interface/Business/
      src/Interface/Repository/
    3.integrations/cases-integrations/    @lila/cases-integrations
    4.persistence/cases-persistence/      @lila/cases-persistence
    5.models/cases-models/                @lila/cases-models
    6.infrastructure/cases-infrastructure/
  Gateway/
    Controller/                           @lila/gateway-controller
    Model/                                @lila/gateway-model
    Proxy/                                @lila/gateway-proxy
shared/
  response/                               @lila/response
  errors/                                 @lila/errors
```

Cada carpeta de paquete contiene package.json, src y exportaciones públicas.
Los nombres de las carpetas numeradas son organizativos. Las dependencias se resuelven
por nombre npm, por ejemplo:

```js
const { CasoService } = require("@lila/cases-business");
const { CasoRepository } = require("@lila/cases-persistence");
const { ApiResponse } = require("@lila/response");
```

Los imports relativos se limitan al interior de cada paquete. Business recibe repositorios
por constructor; no importa Express ni Sequelize. Infrastructure compone los servicios,
repositorios y contexto. Persistence recibe configuración y construye contextos sin
conectarse al importar el paquete. Gateway no importa paquetes internos de Casos y no
tiene Persistence porque no utiliza una base de datos.

## Instalación y ejecución

1. Ejecutar `npm install` desde Backend. npm enlaza los workspaces por sus nombres.
2. Copiar `APIs/Cases/6.infrastructure/cases-infrastructure/.env.example` a `APIs/Cases/6.infrastructure/cases-infrastructure/.env` y configurar MySQL.
3. Copiar `APIs/Gateway/Controller/.env.example` a `APIs/Gateway/Controller/.env`.
4. Ejecutar `npm start` para ambos procesos, o `npm run dev` para modo watch.

Para procesos independientes:

```sh
npm run start:cases
npm run start:gateway
```

También pueden ejecutarse los scripts start/dev desde el directorio de cada API.
Casos carga su .env desde `6.infrastructure/cases-infrastructure` y Gateway desde
`Gateway/Controller`. ENV_FILE permite indicar otro archivo. Las variables del proceso tienen prioridad.
Las credenciales del antiguo appsettings.json deben trasladarse al .env local; no se
incluyen contraseñas reales en archivos versionados.

Hosts predeterminados: 127.0.0.1. Para contenedores configurar CASES_HOST/GATEWAY_HOST
a 0.0.0.0 y CASES_SERVICE_URL al nombre DNS del servicio. Configurar CORS_ORIGINS con
los orígenes exactos del frontend, separados por comas. No se ha añadido autenticación:
los endpoints conservan el alcance de acceso del backend original.

## Rutas

El cliente accede al gateway:
- /api/casos
- /api/evidencias
- /api/responsables
- /api/tipos-acoso
- /api/usuarios
- Gateway: /api-docs/ y /openapi.json

Los métodos y rutas originales se conservan. Las respuestas JSON de negocio ahora
incluyen data; el frontend deberá usar response.data en vez del cuerpo sin envoltura.
El resultado de creación de caso está en data.codigoCaso.

```json
{
  "success": true,
  "message": "Caso creado correctamente",
  "data": { "codigoCaso": "#AB-12345" },
  "meta": null,
  "error": null,
  "traceId": "request-id",
  "timestamp": "2026-09-12T00:00:00.000Z"
}
```

Los errores usan success=false, data=null y error={code,details}, conservando códigos
HTTP 400, 404, 409, 500, 503 o 504. El gateway conserva la respuesta del servicio, sin
envolverla por segunda vez. OpenAPI, HTML y binarios mantienen sus formatos propios.
El identificador viaja en x-request-id y en traceId.

El código de consulta contiene #; codificar el segmento con encodeURIComponent
(por ejemplo %23AB-12345) para que no se interprete como fragmento de URL.

GET /health en cada proceso comprueba que responde. GET /ready en Casos comprueba
la conexión a MySQL. La salud del gateway no implica que todos los servicios estén listos.
Swagger del Gateway: http://127.0.0.1:3000/api-docs/ y describe las rutas públicas y sus destinos.
Swagger de Casos: http://127.0.0.1:3001/api-docs/ y describe el microservicio de Casos.

## Usuarios y propiedad de datos

Se conserva temporalmente Usuario dentro del servicio Casos para no eliminar sus
endpoints existentes. No se creó un microservicio Usuarios vacío. USERS_SERVICE_URL
permite enrutar /api/usuarios a un servicio separado cuando se implemente.
El paquete cases-integrations ofrece un cliente HTTP para esa futura integración,
pero no se ejecutan consultas remotas de usuarios durante esta fase.

Casos mantiene el esquema LILA actual, incluyendo las relaciones con usuarios.
Separar físicamente la base de Usuarios requerirá trabajo posterior sobre los datos,
las claves foráneas y los contratos de integración. Configurar la ruta del gateway
por sí solo no completa esa separación.

## Reutilización y verificación

```sh
npm test
npm run check:packages
npm pack --workspace=@lila/cases-business --dry-run
```

Las pruebas usan repositorios y servidores locales de prueba, sin escribir en MySQL.
Cubren contratos HTTP, proxy, timeout, errores, imports y persistencia mediante dobles.

Los paquetes de biblioteca tienen version, main, exports, files y dependencias declaradas
por versión. Pueden empaquetarse con npm pack y consumirse desde otro proyecto instalando
también sus dependencias @lila (tarballs o registro privado). Para publicar, configurar
un registro privado y versionar sus dependencias; este trabajo no publica paquetes.
Mover un paquete dentro del monorepo requiere actualizar el patrón de workspaces si
deja de coincidir y ejecutar npm install; los consumidores mantienen sus imports por nombre.

