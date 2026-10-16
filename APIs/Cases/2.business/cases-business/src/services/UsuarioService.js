const { ValidationError } = require("@lila/errors");
const { Usuario } = require("@lila/cases-models");
const IUsuarioBusiness = require("../Interface/Business/IUsuarioBusiness");
const crypto = require("node:crypto");
const { validarId } = require("../helpers/validator");

function validarUsuario(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new ValidationError("Los datos deben ser un objeto");
  }
  const errores = [];
  for (const campo of ["correoEmail", "telefono", "deviceId"]) {
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

    if (data.deviceId) {
      const usuarioExistente = await this.usuarioRepository.obtenerPorDeviceId(data.deviceId);
      if (usuarioExistente) return usuarioExistente;
    }

    const usuario = new Usuario({
      idUsuario: crypto.randomUUID(),
      telefono: data.telefono,
      cedula: data.cedula || null ,
      correoEmail: data.correoEmail,
      estado: data.estado ?? true,
      deviceId:  data.deviceId
    });



    return await this.usuarioRepository.crear(usuario);
  }

  async obtenerPorId(idUsuario) {
    validarId(idUsuario, "idUsuario");
    return await this.usuarioRepository.obtenerPorId(idUsuario);
  }

  async obtenerPorCorreo(correoEmail) {
    return await this.usuarioRepository.obtenerPorCorreo(correoEmail);
  }

  async obtenerTodos() {
    return await this.usuarioRepository.obtenerTodos();
  }

  async actualizar(idUsuario, datos) {
    validarId(idUsuario, "idUsuario");
    validarUsuario(datos);
    return await this.usuarioRepository.actualizar(idUsuario, datos);
  }

  async eliminar(idUsuario) {
    validarId(idUsuario, "idUsuario");
    return await this.usuarioRepository.eliminar(idUsuario);
  }
}

module.exports = UsuarioService;
