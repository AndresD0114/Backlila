const { ValidationError } = require("@lila/errors");
const { Usuario } = require("@lila/cases-models");
const IUsuarioBusiness = require("../Interface/Business/IUsuarioBusiness");

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validarId(value) {
  if (!uuid.test(value)) throw new ValidationError("idUsuario debe ser un UUID");
}

function validarUsuario(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new ValidationError("Los datos deben ser un objeto");
  }
  const errores = [];
  for (const campo of ["correoEmail", "telefono"]) {
    if (data[campo] != null && typeof data[campo] !== "string") errores.push(campo + " debe ser texto");
  }
  if (errores.length) throw new ValidationError("Datos inválidos", errores);
}

class UsuarioService extends IUsuarioBusiness {
  /**
   * @param {IUsuarioRepository} usuarioRepository
   */
  constructor(usuarioRepository) {
    super();
    this.usuarioRepository = usuarioRepository;
  }

  async crear(data) {
    validarUsuario(data);
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



    return await this.usuarioRepository.crear(usuario);
  }

  async obtenerPorId(idUsuario) {
    validarId(idUsuario);
    return await this.usuarioRepository.obtenerPorId(idUsuario);
  }

  async obtenerPorCorreo(correoEmail) {
    return await this.usuarioRepository.obtenerPorCorreo(correoEmail);
  }

  async obtenerTodos() {
    return await this.usuarioRepository.obtenerTodos();
  }

  async actualizar(idUsuario, datos) {
    validarId(idUsuario);
    validarUsuario(datos);
    return await this.usuarioRepository.actualizar(idUsuario, datos);
  }

  async eliminar(idUsuario) {
    validarId(idUsuario);
    return await this.usuarioRepository.eliminar(idUsuario);
  }
}

module.exports = UsuarioService;
