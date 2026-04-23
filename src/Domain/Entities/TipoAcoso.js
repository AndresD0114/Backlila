// clase que define

class TipoAcoso {
  constructor({
    idTipoAcoso = null,
    descripcion
  }) {
    this.idTipoAcoso = idTipoAcoso;
    this.descripcion = descripcion;
  }
}

module.exports = TipoAcoso;