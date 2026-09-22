class IResponsableRepository {
  async crear(responsable) { throw new Error("Debe implementar crear"); }
  async obtenerPorId(idResponsable) { throw new Error("Debe implementar obtenerPorId"); }
  async obtenerTodos() { throw new Error("Debe implementar obtenerTodos"); }
  async actualizar(idResponsable, datos) { throw new Error("Debe implementar actualizar"); }
  async eliminar(idResponsable) { throw new Error("Debe implementar eliminar"); }
}

module.exports = IResponsableRepository;
