const Usuario = require("../Entities/Usuario");

class IUsuarioRepository {
 
  async crear(usuario) {}
  
  async obtenerPorId(idUsuario) {}

  async obtenerPorCedula(cedula){}

  async obtenerPorCorreo(correoEmail) {}

  async obtenerTodos() {}

  async actualizar(idUsuario, datos) {}

  async eliminar(idUsuario) {}
}

module.exports = IUsuarioRepository;