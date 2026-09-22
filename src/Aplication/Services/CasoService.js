const Caso = require("../../Domain/Entities/Caso");
const ICaso = require("../../Domain/Interfaces/ICaso");
const crypto = require("crypto");


class CasoService {
  /**
   * @param {ICaso} _ICaso
   */
  constructor(ICaso) {
    this._ICaso = ICaso;
  }

  async crear(data) {
  const codigoPlano = await this.generarCodigoUnico();
    const codigoHash = this.hashCodigo(codigoPlano);


    const caso = new Caso({
    idUsuario : data.idUsuario,
    idTipoAcoso: data.idTipoAcoso,
    idResponsable: data.idResponsable || null,
    codigoCaso: codigoHash,
    pasoInstitucion: data.pasoInstitucion === true || data.pasoInstitucion === "true"
    ? true
    : false,
    descripcion: data.descripcion,
    estado: data.estado
    });



    await this._ICaso.crear(caso);

    return{
         codigoCaso: codigoPlano
    };
  }
  
  async obtenerPorId(idCaso) {
    return await this._ICaso.obtenerPorId(idCaso);
  }

   async obtenerPorUsuario(idCaso) {
        return await this._ICaso.obtenerPorUsuario(idCaso);
   }

  async obtenerTodos() {
        return await this._ICaso.obtenerTodos();
  }
  async obtenerPorCodigo(codigoCaso) {
      const hash = this.hashCodigo(codigoCaso);

        return await this._ICaso.obtenerPorCodigo(hash);
    }

  async actualizar(idCaso, datos) {
        return await this._ICaso.actualizar(idCaso, datos);
  }

  async eliminar(idCaso) {
        return await this._ICaso.eliminar(idCaso);

  }

   generarCodigoCaso() {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const alfanum = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  // Prefijo aleatorio (2 letras)
  let prefijo = "";
  for (let i = 0; i < 2; i++) {
    prefijo += letras.charAt(Math.floor(Math.random() * letras.length));
  }

  // Código principal (5 caracteres)
  let codigo = "";
  for (let i = 0; i < 5; i++) {
    codigo += alfanum.charAt(Math.floor(Math.random() * alfanum.length));
  }

  return `#${prefijo}-${codigo}`;
}
 async generarCodigoUnico() {
  let codigo;
  let existe = true;

  while (existe) {
    codigo = this.generarCodigoCaso();
    const caso = await this.obtenerPorCodigo(codigo);

    if (!caso) {
      existe = false;
    }
  }

  return codigo;
}
hashCodigo(codigo) {
  return crypto
    .createHash("sha256")
    .update(codigo)
    .digest("hex");
}

} 

module.exports = CasoService;