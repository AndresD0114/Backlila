const { ValidationError } = require("@lila/errors");
const { Caso } = require("@lila/cases-models");
const ICasoBusiness = require("../Interface/Business/ICasoBusiness");
const crypto = require("crypto");

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validarId(value, nombre) {
  if (!uuid.test(value)) throw new ValidationError(nombre + " debe ser un UUID");
}

function validarCaso(data, parcial = false) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new ValidationError("Los datos deben ser un objeto");
  }

  const errores = [];
  if (!parcial) {
    if (!data.idUsuario) errores.push("idUsuario es obligatorio");
    if (data.idTipoAcoso == null || data.idTipoAcoso === "") errores.push("idTipoAcoso es obligatorio");
  }
  if (data.idUsuario != null && !uuid.test(data.idUsuario)) errores.push("idUsuario debe ser un UUID");
  if (data.idResponsable != null && !uuid.test(data.idResponsable)) errores.push("idResponsable debe ser un UUID");
  if (data.idTipoAcoso != null && (!Number.isInteger(Number(data.idTipoAcoso)) || Number(data.idTipoAcoso) < 1)) errores.push("idTipoAcoso debe ser un entero positivo");
  if (data.descripcion != null && typeof data.descripcion !== "string") errores.push("descripcion debe ser texto");
  if (data.pasoInstitucion != null && ![true, false, "true", "false"].includes(data.pasoInstitucion)) errores.push("pasoInstitucion debe ser booleano");

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

  async crear(data) {
    validarCaso(data);
    const codigoPlano = await this.generarCodigoUnico();
    const codigoHash = this.hashCodigo(codigoPlano);

    const caso = new Caso({
      idUsuario: data.idUsuario,
      idTipoAcoso: data.idTipoAcoso,
      idResponsable: data.idResponsable || null,
      codigoCaso: codigoHash,
      pasoInstitucion: data.pasoInstitucion === true || data.pasoInstitucion === "true",
      descripcion: data.descripcion,
      estado: data.estado
    });

    await this.casoRepository.crear(caso);
    return { codigoCaso: codigoPlano };
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
    const hash = this.hashCodigo(codigoCaso);
    return await this.casoRepository.obtenerPorCodigo(hash);
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

  generarCodigoCaso() {
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

  async generarCodigoUnico() {
    let codigo;
    let existe = true;
    while (existe) {
      codigo = this.generarCodigoCaso();
      existe = Boolean(await this.obtenerPorCodigo(codigo));
    }
    return codigo;
  }

  hashCodigo(codigo) {
    return crypto.createHash("sha256").update(codigo).digest("hex");
  }
}

module.exports = CasoService;
