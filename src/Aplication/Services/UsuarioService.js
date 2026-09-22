const Usuario = require("../../Domain/Entities/Usuario");
const IUsuario = require("../../Domain/Interfaces/IUsuario");

class UsuarioService {
  /**
   * @param {IUsuario} _IUsuario
   */
  constructor(IUsuario) {
    this._IUsuario = IUsuario;
  }

  async crear(data) {
    const usuario = new Usuario({
      telefono: data.telefono,
      cedula: data.cedula || null ,
      sexoBiologico: data.sexoBiologico,
      orientacionGenero: data.orientacionGenero,
      correoEmail: data.correoEmail,
      tipoUsuario: data.tipoUsuario,
      estado: data.estado ?? true,
      deviceId:  data.deviceId
    });



    return await this._IUsuario.crear(usuario);
  }

  async obtenerPorId(idUsuario) {
    return await this._IUsuario.obtenerPorId(idUsuario);
  }

  async obtenerPorCorreo(correoEmail) {
    return await this._IUsuario.obtenerPorCorreo(correoEmail);
  }

  async obtenerTodos() {
    return await this._IUsuario.obtenerTodos();
  }

  async actualizar(idUsuario, datos) {
    return await this._IUsuario.actualizar(idUsuario, datos);
  }

  async eliminar(idUsuario) {
    return await this._IUsuario.eliminar(idUsuario);
  }
}

module.exports = UsuarioService;