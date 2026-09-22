const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const { requestId, notFound, errorHandler } = require("@lila/errors");
const { ApiResponse } = require("@lila/response");
const { createRouteTable, resolveRoute } = require("@lila/gateway-model");
const { createProxy } = require("@lila/gateway-proxy");
const { createSpec } = require("./swagger");

function createRouting(config) {
  const routes = createRouteTable(config);
  const proxies = new Map(routes.map(route => [route.target, createProxy(route.target, config)]));
  return (req, res, next) => {
    const route = resolveRoute(routes, req.path);
    return route ? proxies.get(route.target)(req, res, next) : next();
  };
}

function createApp(config) {
  const app = express();
  const spec = createSpec();

  app.disable("x-powered-by");
  app.use(requestId);
  app.use(cors({ origin: config.corsOrigins.length ? config.corsOrigins : false, exposedHeaders: ["x-request-id"] }));
  app.get("/health", (req, res) => ApiResponse.ok(res, { service: "gateway", status: "ok" }));
  app.get("/", (req, res) => ApiResponse.ok(res, null, "Gateway LILA funcionando"));
  app.get("/openapi.json", (req, res) => res.json(spec));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));
  app.use(createRouting(config));
  app.use(notFound, errorHandler);

  return app;
}

module.exports = { createApp };

