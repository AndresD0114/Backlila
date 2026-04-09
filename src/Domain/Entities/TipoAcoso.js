// clase que define

class TipoAcoso {
  constructor({
    id_tipo_acoso = null,
    descripcion
  }) {
    this.id_tipo_acoso = id_tipo_acoso;
    this.descripcion = descripcion;
  }
}

module.exports = TipoAcoso;