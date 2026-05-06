

class Evidencia {
  constructor({
    idEvidencia = null,
    idCaso,
    tipoArchivo,
    urlArchivo,
    fechaSubida,
    
  }) {
    this.idEvidencia= idEvidencia;
    this.idCaso = idCaso;
    this.tipoArchivo = tipoArchivo;
    this.urlArchivo = urlArchivo;
    this.fechaSubida = fechaSubida;
  }
}


module.exports = Evidencia;