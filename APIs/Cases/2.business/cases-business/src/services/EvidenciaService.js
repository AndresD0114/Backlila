const { ValidationError } = require("@lila/errors");
const { Evidencia } = require("@lila/cases-models");
const IEvidenciaBusiness = require("../Interface/Business/IEvidenciaBusiness");

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validarId(value, nombre) {
  if (!uuid.test(value)) throw new ValidationError(nombre + " debe ser un UUID");
}

function validarEvidencia(data, parcial = false) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new ValidationError("Los datos deben ser un objeto");
  }
  const errores = [];
  if (!parcial && !data.idCaso) errores.push("idCaso es obligatorio");
  if (data.idCaso != null && !uuid.test(data.idCaso)) errores.push("idCaso debe ser un UUID");
  for (const campo of ["tipoArchivo", "urlArchivo"]) {
    if (data[campo] != null && typeof data[campo] !== "string") errores.push(campo + " debe ser texto");
  }
  if (errores.length) throw new ValidationError("Datos inválidos", errores);
}

class EvidenciaService extends IEvidenciaBusiness {
  /**
   * @param {IEvidenciaRepository} evidenciaRepository
   */
  constructor(evidenciaRepository) {
    super();
    this.evidenciaRepository = evidenciaRepository;
  }

  async crear(data) {
    validarEvidencia(data);
    const evidencia = new Evidencia({
    idCaso: data.idCaso,
    tipoArchivo: data.tipoArchivo,
    urlArchivo: data.urlArchivo,
    });



    return await this.evidenciaRepository.crear(evidencia);
  }
  
  async obtenerPorId(idEvidencia) {
    validarId(idEvidencia, "idEvidencia");
    return await this.evidenciaRepository.obtenerPorId(idEvidencia);
  }

  async obtenerPorCaso(idCaso) {
    validarId(idCaso, "idCaso");
    return await this.evidenciaRepository.obtenerPorCaso(idCaso);
  }

  async obtenerTodos() {
        return await this.evidenciaRepository.obtenerTodos();
  }

  async actualizar(idEvidencia, datos) {
    validarId(idEvidencia, "idEvidencia");
    validarEvidencia(datos, true);
    return await this.evidenciaRepository.actualizar(idEvidencia, datos);
  }

  async eliminar(idEvidencia) {
    validarId(idEvidencia, "idEvidencia");
    return await this.evidenciaRepository.eliminar(idEvidencia);
  }

  
}

module.exports = EvidenciaService;
