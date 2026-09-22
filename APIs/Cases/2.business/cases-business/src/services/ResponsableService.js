const { ValidationError } = require("@lila/errors");
const { Responsable } = require("@lila/cases-models");
const IResponsableBusiness = require("../Interface/Business/IResponsableBusiness");

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validarId(value) {
  if (!uuid.test(value)) throw new ValidationError("idResponsable debe ser un UUID");
}

function validarResponsable(data, parcial = false) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new ValidationError("Los datos deben ser un objeto");
  }
  const errores = [];
  if (!parcial && !data.nombre) errores.push("nombre es obligatorio");
  for (const campo of ["nombre", "telefono", "cargo", "correoEmail"]) {
    if (data[campo] != null && typeof data[campo] !== "string") errores.push(campo + " debe ser texto");
  }
  if (errores.length) throw new ValidationError("Datos inválidos", errores);
}

class ResponsableService extends IResponsableBusiness {
  /**
   * @param {IResponsableRepository} responsableRepository
   */
  constructor(responsableRepository) {
    super();
    this.responsableRepository = responsableRepository;
  }

  async crear(data) {
    validarResponsable(data);
    const responsable = new Responsable({
    nombre: data.nombre,
    telefono: data.telefono,
    cargo: data.cargo,
    correoEmail: data.correoEmail
    });



    return await this.responsableRepository.crear(responsable);
  }
  
  async obtenerPorId(idResponsable) {
    validarId(idResponsable);
    return await this.responsableRepository.obtenerPorId(idResponsable);
  }

  async obtenerTodos() {
        return await this.responsableRepository.obtenerTodos();
  }

  async actualizar(idResponsable, datos) {
    validarId(idResponsable);
    validarResponsable(datos, true);
    return await this.responsableRepository.actualizar(idResponsable, datos);
  }

  async eliminar(idResponsable) {
    validarId(idResponsable);
    return await this.responsableRepository.eliminar(idResponsable);
  }

  
}

module.exports = ResponsableService;
