const Evidencia = require("../../Domain/Entities/Evidencia");
const IEvidencia = require("../../Domain/Interfaces/IEvidencia");

class EvidenciaService {
  /**
   * @param {IEvidencia} _IEvidencia
   */
  constructor(IEvidencia) {
    this._IEvidencia = IEvidencia;
  }

  async crear(data) {
    const evidencia = new Evidencia({
    idCaso: data.idCaso,
    tipoArchivo: data.tipoArchivo,
    urlArchivo: data.urlArchivo,
    });



    return await this._IEvidencia.crear(evidencia);
  }
  
  async obtenerPorId(idEvidencia) {
    return await this._IEvidencia.obtenerPorId(idEvidencia);
  }

   async obtenerPorCaso(idCaso) {
        return await this._IEvidencia.obtenerPorCaso(idCaso);
   }

  async obtenerTodos() {
        return await this._IEvidencia.obtenerTodos();
  }

  async actualizar(idEvidencia, datos) {
        return await this._IEvidencia.actualizar(idEvidencia, datos);
  }

  async eliminar(idEvidencia) {
        return await this._IEvidencia.eliminar(idEvidencia);

  }

  
}

module.exports = EvidenciaService;