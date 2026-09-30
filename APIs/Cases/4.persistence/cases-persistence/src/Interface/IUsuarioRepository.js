class IUsuarioRepository {
  async crear(usuario) { throw new Error("Debe implementar crear"); }
  async obtenerPorId(idUsuario) { throw new Error("Debe implementar obtenerPorId"); }
  async obtenerPorCorreo(correoEmail) { throw new Error("Debe implementar obtenerPorCorreo"); }
  async obtenerPorDeviceId(deviceId) { throw new Error("Debe implementar obtenerPorDeviceId"); }
  async obtenerTodos() { throw new Error("Debe implementar obtenerTodos"); }
  async actualizar(idUsuario, datos) { throw new Error("Debe implementar actualizar"); }
  async eliminar(idUsuario) { throw new Error("Debe implementar eliminar"); }
}

module.exports = IUsuarioRepository;
