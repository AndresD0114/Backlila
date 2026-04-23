class Caso {
  constructor({
    idCaso = null,
    idUsuario,
    idTipoAcoso,
    idResponsable,
    codigoCaso,
    pasoInstitucion,
    descripcion,
    estado = "pendiente"
  }) {
    this.idCaso = idCaso;
    this.idUsuario = idUsuario;
    this.idTipoAcoso = idTipoAcoso;
    this.idResponsable = idResponsable;
    this.codigoCaso = codigoCaso;
    this.pasoInstitucion = pasoInstitucion;
    this.descripcion = descripcion;
    this.estado = estado;
  }
}
module.exports = Caso;