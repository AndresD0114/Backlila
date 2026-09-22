const express = require("express");
const swaggerUi = require("swagger-ui-express");
const {
  requestId,
  notFound,
  errorHandler,
  Controllers,
  createSpec,
  Routers
} = require("@lila/cases-middleware");
const { ApiResponse } = require("@lila/response");
const { ServiceUnavailableError } = require("@lila/errors");

const API_PATH = "/api";

function createControllers(services) {
  return {
    Caso: new Controllers.CasoController(services.Caso),
    Evidencia: new Controllers.EvidenciaController(services.Evidencia),
    Responsable: new Controllers.ResponsableController(services.Responsable),
    TipoAcoso: new Controllers.TipoAcosoController(services.TipoAcoso),
    Usuario: new Controllers.UsuarioController(services.Usuario)
  };
}

function configureApplication(app) {
  app.disable("x-powered-by");
  app.use(requestId, express.json({ limit: "1mb" }));
}

function registerSystemRoutes(app, checkReady) {
  app.get("/", (_req, res) => {
    return ApiResponse.ok(res, null, "API de casos funcionando");
  });

  app.get("/health", (_req, res) => {
    return ApiResponse.ok(res, {
      service: "cases",
      status: "ok"
    });
  });

  app.get("/ready", async (_req, res) => {
    try {
      await checkReady();
    } catch {
      throw new ServiceUnavailableError("Base de datos no disponible");
    }

    return ApiResponse.ok(res, {
      service: "cases",
      status: "ready"
    });
  });
}

function registerBusinessRoutes(app, controllers) {
  app.use(API_PATH, Routers.Caso(controllers.Caso));
  app.use(API_PATH, Routers.Evidencia(controllers.Evidencia));
  app.use(API_PATH, Routers.Responsable(controllers.Responsable));
  app.use(API_PATH, Routers.TipoAcoso(controllers.TipoAcoso));
  app.use(API_PATH, Routers.Usuario(controllers.Usuario));
}

function registerSwagger(app) {
  const spec = createSpec();

  app.get("/openapi.json", (_req, res) => res.json(spec));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));
}

function registerErrorHandlers(app) {
  app.use(notFound, errorHandler);
}

function createApp({ services, checkReady = async () => {} }) {
  const app = express();
  const controllers = createControllers(services);

  configureApplication(app);
  registerSystemRoutes(app, checkReady);
  registerBusinessRoutes(app, controllers);
  registerSwagger(app);
  registerErrorHandlers(app);

  return app;
}

module.exports = { createApp };
