class ICasoRepository {
  async crear(caso) { throw new Error("Debe implementar crear"); }
  async obtenerPorId(idCaso) { throw new Error("Debe implementar obtenerPorId"); }
  async obtenerPorUsuario(idUsuario) { throw new Error("Debe implementar obtenerPorUsuario"); }
  async obtenerPorCodigo(codigoCaso) { throw new Error("Debe implementar obtenerPorCodigo"); }
  async obtenerTodos() { throw new Error("Debe implementar obtenerTodos"); }
  async actualizar(idCaso, datos) { throw new Error("Debe implementar actualizar"); }
  async eliminar(idCaso) { throw new Error("Debe implementar eliminar"); }
}

module.exports = ICasoRepository;
