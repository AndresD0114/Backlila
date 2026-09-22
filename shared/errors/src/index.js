const { randomUUID } = require("node:crypto");
const { ApiResponse } = require("@lila/response");
class AppError extends Error {
  constructor(message, status = 500, code = "INTERNAL_ERROR", details = null) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
class ValidationError extends AppError {
  constructor(message = "Solicitud inválida", details = null) { super(message, 400, "VALIDATION_ERROR", details); }
}
class NotFoundError extends AppError {
  constructor(message = "Recurso no encontrado", code = "NOT_FOUND") { super(message, 404, code); }
}
class ConflictError extends AppError {
  constructor(message = "El recurso ya existe") { super(message, 409, "CONFLICT"); }
}
class ServiceUnavailableError extends AppError {
  constructor(message = "Servicio no disponible") { super(message, 503, "SERVICE_UNAVAILABLE"); }
}
function requestId(req, res, next) {
  const incoming = req.get("x-request-id");
  res.locals.traceId = incoming && /^[a-zA-Z0-9_-]{1,100}$/.test(incoming) ? incoming : randomUUID();
  res.set("x-request-id", res.locals.traceId);
  next();
}
function notFound(req, res, next) { next(new NotFoundError("Ruta no encontrada")); }
function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  let mapped = error;
  if (error.type === "entity.parse.failed" || error instanceof URIError) mapped = new ValidationError("Solicitud mal formada");
  else if (error.type === "entity.too.large") mapped = new AppError("Solicitud demasiado grande", 413, "PAYLOAD_TOO_LARGE");
  else if (error.name === "SequelizeUniqueConstraintError") mapped = new ConflictError();
  else if (error.name === "SequelizeForeignKeyConstraintError") mapped = new ConflictError("La referencia no existe o tiene recursos asociados");
  else if (error.name === "SequelizeValidationError") mapped = new ValidationError("Datos inválidos");
  if (!(mapped instanceof AppError)) {
    console.error(JSON.stringify({ traceId: res.locals.traceId, errorType: error.name || "Error" }));
    mapped = new AppError("Error interno del servidor");
  }
  return ApiResponse.failure(res, mapped.status, mapped.message, mapped.code, mapped.details);
}
module.exports = { AppError, ValidationError, NotFoundError, ConflictError, ServiceUnavailableError, requestId, notFound, errorHandler };

