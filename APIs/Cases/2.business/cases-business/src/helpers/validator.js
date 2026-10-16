const { ValidationError } = require("@lila/errors");

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function esUuid(value) {
  return typeof value === "string" && UUID_REGEX.test(value);
}

function validarId(value, nombre = "id") {
  if (!esUuid(value)) {
    throw new ValidationError(`${nombre} debe ser un UUID`);
  }
}

module.exports = {
  esUuid,
  validarId
};
