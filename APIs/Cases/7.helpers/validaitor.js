const { ValidationError } = require("@lila/errors");
const UUID_REGEX =  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;


function validarId(value, nombre = "id") {
  if (typeof value !== "string" || !UUID_REGEX.test(value)) {
    throw new ValidationError(`${nombre} debe ser un UUID`);
  }
}
module.exports = validarId;