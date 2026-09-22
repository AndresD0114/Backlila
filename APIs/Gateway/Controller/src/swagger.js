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
    required: ["idUsuario", "idTipoAcoso"],
    properties: {
      idUsuario: { type: "string", format: "uuid" },
      idTipoAcoso: { type: "integer" },
      idResponsable: { type: "string", format: "uuid", nullable: true },
      pasoInstitucion: { type: "boolean" },
      descripcion: { type: "string" },
      estado: { type: "string" }
    }
  },
  Evidencia: {
    type: "object",
    required: ["idCaso"],
    properties: {
      idCaso: { type: "string", format: "uuid" },
      tipoArchivo: { type: "string" },
      urlArchivo: { type: "string" }
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
  Caso: { idUsuario: "00000000-0000-0000-0000-000000000000", idTipoAcoso: 1, pasoInstitucion: false, descripcion: "Texto", estado: "pendiente" },
  Evidencia: { idCaso: "00000000-0000-0000-0000-000000000000", tipoArchivo: "imagen", urlArchivo: "https://example.com/file" },
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
      { name: "Evidencias" },
      { name: "Responsables" },
      { name: "Tipos de acoso" },
      { name: "Usuarios" }
    ],
    paths: {
      "/health": { get: { tags: ["Gateway"], summary: "Estado", responses: { "200": response("Correcto") } } },
      "/api/casos": operations("Casos", "Casos", [["get", "200"], ["post", "201", "Caso"]]),
      "/api/casos/{id}": operations("Casos", "Caso por ID", [["get", "200"], ["put", "200", "Caso"], ["delete", "200"]], [pathParameter("id", "ID")]),
      "/api/casos/codigo/{codigo}": operations("Casos", "Caso por código", [["get", "200"]], [pathParameter("codigo", "Código")]),
      "/api/evidencias": operations("Evidencias", "Evidencias", [["get", "200"], ["post", "201", "Evidencia"]]),
      "/api/evidencias/{id}": operations("Evidencias", "Evidencia por ID", [["get", "200"], ["put", "200", "Evidencia"], ["delete", "200"]], [pathParameter("id", "ID")]),
      "/api/evidencias/caso/{idCaso}": operations("Evidencias", "Evidencias por caso", [["get", "200"]], [pathParameter("idCaso", "ID del caso")]),
      "/api/responsables": operations("Responsables", "Responsables", [["get", "200"], ["post", "201", "Responsable"]]),
      "/api/responsables/{id}": operations("Responsables", "Responsable por ID", [["get", "200"], ["put", "200", "Responsable"], ["delete", "200"]], [pathParameter("id", "ID")]),
      "/api/tipos-acoso": operations("Tipos de acoso", "Tipos de acoso", [["get", "200"]]),
      "/api/usuarios": operations("Usuarios", "Usuarios", [["get", "200"], ["post", "201", "Usuario"]])
    },
    components: { schemas }
  };
}

module.exports = { createSpec };

