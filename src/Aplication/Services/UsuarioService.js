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
      sexo_biologico: data.sexo_biologico,
      orientacion_genero: data.orientacion_genero,
      correo_email: data.correo_email,
      tipo_usuario: data.tipo_usuario,
      estado: data.estado ?? true
    });



    return await this._IUsuario.crear(usuario);
  }

  async obtenerPorId(id_usuario) {
    return await this._IUsuario.obtenerPorId(id_usuario);
  }

  async obtenerPorCorreo(correo_email) {
    return await this._IUsuario.obtenerPorCorreo(correo_email);
  }

  async obtenerTodos() {
    return await this._IUsuario.obtenerTodos();
  }

  async actualizar(id_usuario, datos) {
    return await this._IUsuario.actualizar(id_usuario, datos);
  }

  async eliminar(id_usuario) {
    return await this._IUsuario.eliminar(id_usuario);
  }
}

module.exports = UsuarioService;