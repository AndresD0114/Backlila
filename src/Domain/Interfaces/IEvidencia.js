const Evidencia = require("../Entities/Evidencia");

class IEvidenciaRepository {
 
  async crear(evidencia) {}
  
  async obtenerPorId(idEvidencia) {}

  async obtenerPorCaso(idCaso) {}

  async obtenerTodos() {}

  async actualizar(idEvidencia, datos) {}

  async eliminar(idCaso) {}
}

module.exports = IEvidenciaRepository;