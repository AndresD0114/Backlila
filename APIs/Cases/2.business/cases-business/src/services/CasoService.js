const { ValidationError } = require("@lila/errors");

const {
  Caso,
  ConsultaCasoDTO,
  CrearCasoDTO,
  InfoAfectado,
  Usuario
} = require("@lila/cases-models");
const ICasoBusiness = require("../Interface/Business/ICasoBusiness");
const crypto = require("crypto");
const { esUuid, validarId } = require("@lila/cases-helpers");


function validarCaso(data, parcial = false) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new ValidationError("Los datos deben ser un objeto");
  }

  const errores = [];
  if (!parcial) {
    if (data.idTipoAcoso == null || data.idTipoAcoso === "") errores.push("idTipoAcoso es obligatorio");
    if (!data.usuario || typeof data.usuario !== "object" || Array.isArray(data.usuario)) {
      errores.push("usuario debe ser un objeto");
    }
    if (!data.infoAfectado || typeof data.infoAfectado !== "object" || Array.isArray(data.infoAfectado)) {
      errores.push("infoAfectado debe ser un objeto");
    }
  }
  if (data.idUsuario != null && !esUuid(data.idUsuario)) errores.push("idUsuario debe ser un UUID");
  if (data.idResponsable != null && !esUuid(data.idResponsable)) errores.push("idResponsable debe ser un UUID");
  if (data.idTipoAcoso != null && (!Number.isInteger(Number(data.idTipoAcoso)) || Number(data.idTipoAcoso) < 1)) errores.push("idTipoAcoso debe ser un entero positivo");
  if (data.descripcion != null && typeof data.descripcion !== "string") errores.push("descripcion debe ser texto");
  if (data.pasoInstitucion != null && ![true, false, "true", "false"].includes(data.pasoInstitucion)) errores.push("pasoInstitucion debe ser booleano");

  if (!parcial && data.usuario && typeof data.usuario === "object") {
    const usuario = data.usuario;
    const longitudes = {
      cedula: 20,
      telefono: 20,
      correoEmail: 150,
      deviceId: 150
    };

    if (typeof usuario.deviceId !== "string" || !usuario.deviceId.trim()) {
      errores.push("usuario.deviceId es obligatorio y debe ser texto");
    }
    if (usuario.idUsuario != null && !esUuid(usuario.idUsuario)) {
      errores.push("usuario.idUsuario debe ser un UUID");
    }

    for (const [campo, maximo] of Object.entries(longitudes)) {
      if (usuario[campo] != null && typeof usuario[campo] !== "string") {
        errores.push(`usuario.${campo} debe ser texto`);
      } else if (typeof usuario[campo] === "string" && usuario[campo].length > maximo) {
        errores.push(`usuario.${campo} no puede superar ${maximo} caracteres`);
      }
    }
  }

  if (!parcial && data.infoAfectado && typeof data.infoAfectado === "object") {
    const infoAfectado = data.infoAfectado;
    const longitudes = {
      sexoBiologico: 20,
      orientacionGenero: 50,
      tipoUsuario: 30
    };

    for (const [campo, maximo] of Object.entries(longitudes)) {
      if (infoAfectado[campo] != null && typeof infoAfectado[campo] !== "string") {
        errores.push(`infoAfectado.${campo} debe ser texto`);
      } else if (typeof infoAfectado[campo] === "string" && infoAfectado[campo].length > maximo) {
        errores.push(`infoAfectado.${campo} no puede superar ${maximo} caracteres`);
      }
    }
  }

  if (errores.length) throw new ValidationError("Datos inválidos", errores);
}

class CasoService extends ICasoBusiness {
  /**
   * @param {ICasoRepository} casoRepository
   */
  constructor(casoRepository) {
    super();
    this.casoRepository = casoRepository;
  }



  #generarCodigoCaso() {
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const alfanum = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let prefijo = "";
    let codigo = "";
    for (let i = 0; i < 2; i++) {
      prefijo += letras.charAt(crypto.randomInt(letras.length));
    }
    for (let i = 0; i < 5; i++) {
      codigo += alfanum.charAt(crypto.randomInt(alfanum.length));
    }
    return `#${prefijo}-${codigo}`;
  }

  async #generarCodigoUnico() {
    let codigo;
    let existe = true;
    while (existe) {
      codigo = this.#generarCodigoCaso();
      existe = Boolean(await this.obtenerPorCodigo(codigo));
    }
    return codigo;
  }

  #hashCodigo(codigo) {
    return crypto.createHash("sha256").update(codigo).digest("hex");
  }

  async crear(data) {
    validarCaso(data);
    const codigoPlano = await this.#generarCodigoUnico();
    const codigoHash = this.#hashCodigo(codigoPlano);
    const idCaso = crypto.randomUUID();
    const idUsuario = data.usuario.idUsuario || data.idUsuario || crypto.randomUUID();

    const usuario = new Usuario({
      idUsuario,
      cedula: data.usuario.cedula || null,
      telefono: data.usuario.telefono || null,
      correoEmail: data.usuario.correoEmail || null,
      estado: data.usuario.estado ?? true,
      deviceId: data.usuario.deviceId.trim()
    });

    const caso = new Caso({
      idCaso,
      idUsuario,
      idTipoAcoso: data.idTipoAcoso,
      idResponsable: data.idResponsable || null,
      codigoCaso: codigoHash,
      pasoInstitucion: data.pasoInstitucion === true || data.pasoInstitucion === "true",
      descripcion: data.descripcion,
      estado: data.estado
    });
    const infoAfectado = new InfoAfectado({
      sexoBiologico: data.infoAfectado.sexoBiologico || null,
      orientacionGenero: data.infoAfectado.orientacionGenero || null,
      tipoUsuario: data.infoAfectado.tipoUsuario || null,
      idCaso
    });

    const resultado = await this.casoRepository.crear(
      new CrearCasoDTO(usuario, caso, infoAfectado)
    );

    return {
      idCaso,
      idUsuario: resultado.idUsuario,
      codigoCaso: codigoPlano,
      InfoAfectadoID: resultado.InfoAfectadoID,
      UsuarioCreado: resultado.UsuarioCreado
    };
  }
  
  async obtenerPorId(idCaso) {
    validarId(idCaso, "idCaso");
    return await this.casoRepository.obtenerPorId(idCaso);
  }

  async obtenerPorUsuario(idUsuario) {
    validarId(idUsuario, "idUsuario");
    return await this.casoRepository.obtenerPorUsuario(idUsuario);
  }

  async obtenerTodos() {
    return await this.casoRepository.obtenerTodos();
  }

  async obtenerPorCodigo(codigoCaso) {
    const hash = this.#hashCodigo(codigoCaso);
    const caso = await this.casoRepository.obtenerPorCodigo(hash);

    return caso ? new ConsultaCasoDTO(caso, codigoCaso) : null;
  }

  async actualizar(idCaso, datos) {
    validarId(idCaso, "idCaso");
    validarCaso(datos, true);
    return await this.casoRepository.actualizar(idCaso, datos);
  }

  async eliminar(idCaso) {
    validarId(idCaso, "idCaso");
    return await this.casoRepository.eliminar(idCaso);
  }
}

module.exports = CasoService;
