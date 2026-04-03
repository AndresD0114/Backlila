const Usuario = require("../Entities/Usuario");

class IUsuarioRepository {
 
  async crear(usuario) {}
  
  async obtenerPorId(id_usuario) {}

  async obtenerPorCorreo(correo_email) {}

  async obtenerTodos() {}

  async actualizar(id_usuario, datos) {}

  async eliminar(id_usuario) {}
}

module.exports = IUsuarioRepository;