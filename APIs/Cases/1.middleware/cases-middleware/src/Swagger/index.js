const path = require("node:path");
const swaggerJSDoc = require("swagger-jsdoc");
function createSpec() {
  const spec = swaggerJSDoc({
    definition: { 
      openapi: "3.0.0", 
      info: { 
        title: "LILA · Casos",
         version: "2.0.0", 
         description: "Casos, evidencias, responsables, tipos de acoso y usuarios en transición." },
          servers: [{ url: "/" }] },
    apis: [path.join(__dirname, "../Routers/*.js").replace(/\\/g, "/")]
  });
  spec.components = { schemas: {
    ApiResponse:
     { type: "object",
       required: ["success", "message", "data", "meta", "error", "traceId", "timestamp"],
        properties: {
      success: { type: "boolean" }, message: { type: "string" }, data: { nullable: true },
      meta: { type: "object", nullable: true }, error: { type: "object", nullable: true, properties: { code: { type: "string" }, details: { nullable: true } } },
      traceId: { type: "string" }, timestamp: { type: "string", format: "date-time" }
    } }
  } };
  for (const item of Object.values(spec.paths)) for (const operation of Object.values(item)) {
    if (!operation.responses) continue;
    for (const status of ["400", "404", "409", "500"]) operation.responses[status] = { description: "Error con formato ApiResponse" };
    for (const response of Object.values(operation.responses)) response.content = { "application/json": { schema: { $ref: "#/components/schemas/ApiResponse" } } };
  }
  return spec;
}
module.exports = { createSpec };

