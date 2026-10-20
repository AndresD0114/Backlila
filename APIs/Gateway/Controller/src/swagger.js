const schemas = {
  ApiResponse: {
    type: "object",
    properties: {
      success: { type: "boolean" },
      message: { type: "string" },
      data: { nullable: true },
      meta: { nullable: true },
      error: { nullable: true },
      traceId: { type: "string" },
      timestamp: { type: "string", format: "date-time" }
    }
  },
  Caso: {
    type: "object",
    required: ["usuario", "idTipoAcoso", "infoAfectado"],
    properties: {
      idUsuario: { type: "string", format: "uuid" },
      usuario: {
        type: "object",
        required: ["deviceId"],
        properties: {
          idUsuario: { type: "string", format: "uuid" },
          cedula: { type: "string" },
          telefono: { type: "string" },
          correoEmail: { type: "string", format: "email" },
          deviceId: { type: "string" }
        }
      },
      idTipoAcoso: { type: "integer" },
      idResponsable: { type: "string", format: "uuid", nullable: true },
      pasoInstitucion: { type: "boolean" },
      descripcion: { type: "string" },
      estado: { type: "string" },
      infoAfectado: {
        type: "object",
        properties: {
          sexoBiologico: { type: "string" },
          orientacionGenero: { type: "string" },
          tipoUsuario: { type: "string" }
        }
      }
    }
  },
  Responsable: {
    type: "object",
    required: ["nombre"],
    properties: {
      nombre: { type: "string" },
      telefono: { type: "string" },
      cargo: { type: "string" },
      correoEmail: { type: "string", format: "email" }
    }
  },
  Usuario: {
    type: "object",
    properties: {
      cedula: { type: "string" },
      telefono: { type: "string" },
      correoEmail: { type: "string", format: "email" },
      tipoUsuario: { type: "string" },
      deviceId: { type: "string" }
    }
  }
};

const examples = {
  Caso: {
    idUsuario: "00000000-0000-0000-0000-000000000000",
    usuario: {
      idUsuario: "00000000-0000-0000-0000-000000000000",
      deviceId: "device-id"
    },
    idTipoAcoso: 1,
    pasoInstitucion: false,
    descripcion: "Texto",
    estado: "pendiente",
    infoAfectado: {
      sexoBiologico: "Femenino",
      orientacionGenero: "Bisexual",
      tipoUsuario: "adulto"
    }
  },
  Responsable: { nombre: "Nombre", telefono: "3000000000", cargo: "Cargo", correoEmail: "correo@example.com" },
  Usuario: { cedula: "000000000", telefono: "3000000000", correoEmail: "correo@example.com", tipoUsuario: "usuario", deviceId: "device-id" }
};

const response = description => ({
  description,
  content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponse" } } }
});

const pathParameter = (name, description) => ({
  name,
  in: "path",
  required: true,
  description,
  schema: { type: "string" }
});

const requestBody = schema => ({
  required: true,
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/" + schema },
      example: examples[schema]
    }
  }
});

function operations(tag, summary, methods, parameters = []) {
  return Object.fromEntries(methods.map(([method, status, schema]) => [method, {
    tags: [tag],
    summary,
    parameters,
    ...(schema ? { requestBody: requestBody(schema) } : {}),
    responses: {
      [status]: response("Correcto"),
      "400": response("Solicitud inválida"),
      "404": response("No encontrado"),
      "503": response("Servicio no disponible"),
      "504": response("Tiempo agotado")
    }
  }]));
}

function createSpec() {
  return {
    openapi: "3.0.0",
    info: { title: "LILA · API Gateway", version: "1.0.0" },
    servers: [{ url: "/" }],
    tags: [
      { name: "Gateway" },
      { name: "Casos" },
      { name: "Responsables" },
      { name: "Tipos de acoso" },
      { name: "Usuarios" }
    ],
    paths: {
      "/health": { get: { tags: ["Gateway"], summary: "Estado", responses: { "200": response("Correcto") } } },
      "/api/casos": operations("Casos", "Registrar y consultar casos", [["get", "200"], ["post", "201", "Caso"]]),
      "/api/casos/{id}": operations("Casos", "Caso por ID", [["get", "200"], ["put", "200", "Caso"], ["delete", "200"]], [pathParameter("id", "ID")]),
      "/api/casos/codigo/{codigo}": operations("Casos", "Caso por código", [["get", "200"]], [pathParameter("codigo", "Código")]),
      "/api/responsables": operations("Responsables", "Responsables", [["get", "200"], ["post", "201", "Responsable"]]),
      "/api/responsables/{id}": operations("Responsables", "Responsable por ID", [["get", "200"], ["put", "200", "Responsable"], ["delete", "200"]], [pathParameter("id", "ID")]),
      "/api/tipos-acoso": operations("Tipos de acoso", "Tipos de acoso", [["get", "200"]]),
      "/api/usuarios": operations("Usuarios", "Usuarios", [["get", "200"], ["post", "201", "Usuario"]])
    },
    components: { schemas }
  };
}

module.exports = { createSpec };

