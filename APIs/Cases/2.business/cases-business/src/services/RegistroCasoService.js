const crypto = require("node:crypto");
const { ConflictError, NotFoundError, ValidationError } = require("@lila/errors");
const {
  InfoAfectado,
  RegistroCasoDTO,
  Usuario
} = require("@lila/cases-models");
const IRegistroCasoBusiness = require("../Interface/Business/IRegistroCasoBusiness");

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validarRegistro(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new ValidationError("Los datos deben ser un objeto");
  }

  const usuario = data.usuario;
  const infoAfectado = data.infoAfectado;
  const errores = [];

  if (!usuario || typeof usuario !== "object" || Array.isArray(usuario)) {
    errores.push("usuario debe ser un objeto");
  }

  if (!infoAfectado || typeof infoAfectado !== "object" || Array.isArray(infoAfectado)) {
    errores.push("infoAfectado debe ser un objeto");
  }

  if (errores.length) throw new ValidationError("Datos inválidos", errores);

  if (typeof usuario.deviceId !== "string" || !usuario.deviceId.trim()) {
    errores.push("usuario.deviceId es obligatorio y debe ser texto");
  }

  for (const campo of ["cedula", "telefono", "correoEmail"]) {
    if (usuario[campo] != null && typeof usuario[campo] !== "string") {
      errores.push(`usuario.${campo} debe ser texto`);
    }
  }

  const longitudesUsuario = {
    cedula: 20,
    telefono: 20,
    correoEmail: 150,
    deviceId: 150
  };
  for (const [campo, maximo] of Object.entries(longitudesUsuario)) {
    if (typeof usuario[campo] === "string" && usuario[campo].length > maximo) {
      errores.push(`usuario.${campo} no puede superar ${maximo} caracteres`);
    }
  }

  if (!UUID.test(infoAfectado.idCaso)) {
    errores.push("infoAfectado.idCaso debe ser un UUID");
  }

  for (const campo of ["sexoBiologico", "orientacionGenero", "tipoUsuario"]) {
    if (infoAfectado[campo] != null && typeof infoAfectado[campo] !== "string") {
      errores.push(`infoAfectado.${campo} debe ser texto`);
    }
  }


  const longitudesInfoAfectado = {
    sexoBiologico: 20,
    orientacionGenero: 50,
    tipoUsuario: 30
  };
  for (const [campo, maximo] of Object.entries(longitudesInfoAfectado)) {
    if (typeof infoAfectado[campo] === "string" && infoAfectado[campo].length > maximo) {
      errores.push(`infoAfectado.${campo} no puede superar ${maximo} caracteres`);
    }
  }

  if (errores.length) throw new ValidationError("Datos inválidos", errores);
}

class RegistroCasoService extends IRegistroCasoBusiness {
  constructor(registroCasoRepository) {
    super();
    this.registroCasoRepository = registroCasoRepository;
  }

  async registrar(data) {
    validarRegistro(data);

    const deviceId = data.usuario.deviceId.trim();
    const [caso, infoExistente, usuarioExistente] = await Promise.all([
      this.registroCasoRepository.obtenerCasoPorId(data.infoAfectado.idCaso),
      this.registroCasoRepository.obtenerInfoAfectadoPorCaso(data.infoAfectado.idCaso),
      this.registroCasoRepository.obtenerUsuarioPorDeviceId(deviceId)
    ]);

    if (!caso) throw new NotFoundError("El caso indicado no existe", "CASE_NOT_FOUND");
    if (infoExistente) {
      throw new ConflictError("El caso ya tiene información de la persona afectada");
    }

    const idUsuario = usuarioExistente?.idUsuario || crypto.randomUUID();

    const usuario = new Usuario({
      idUsuario,
      cedula: data.usuario.cedula || null,
      telefono: data.usuario.telefono || null,
      correoEmail: data.usuario.correoEmail || null,
      estado: data.usuario.estado ?? true,
      deviceId
    });
    const infoAfectado = new InfoAfectado({
      sexoBiologico: data.infoAfectado.sexoBiologico || null,
      orientacionGenero: data.infoAfectado.orientacionGenero || null,
      tipoUsuario: data.infoAfectado.tipoUsuario || null,
      idCaso: data.infoAfectado.idCaso
    });
    const registro = new RegistroCasoDTO(usuario, infoAfectado);

    return await this.registroCasoRepository.registrar(registro, {
      idUsuario
    });
  }
}

module.exports = RegistroCasoService;
