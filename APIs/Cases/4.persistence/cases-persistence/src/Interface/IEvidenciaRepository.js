class IEvidenciaRepository {
  async crear(evidencia) { throw new Error("Debe implementar crear"); }
  async obtenerPorId(idEvidencia) { throw new Error("Debe implementar obtenerPorId"); }
  async obtenerPorCaso(idCaso) { throw new Error("Debe implementar obtenerPorCaso"); }
  async obtenerTodos() { throw new Error("Debe implementar obtenerTodos"); }
  async actualizar(idEvidencia, datos) { throw new Error("Debe implementar actualizar"); }
  async eliminar(idEvidencia) { throw new Error("Debe implementar eliminar"); }
}

module.exports = IEvidenciaRepository;
