class ConsultaCasoDTO {
  constructor(caso, codigoCaso) {
    const datosCaso = typeof caso.toJSON === "function" ? caso.toJSON() : caso;

    Object.assign(this, datosCaso, { codigoCaso });
  }
}

module.exports = ConsultaCasoDTO;
