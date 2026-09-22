const ITipoAcoso = require("../../Domain/Interfaces/ITipoAcoso");

class TipoAcosoService {
  /**
   * @param {ITipoAcoso} ITipoAcoso
   */
  constructor(ITipoAcoso) {
    this._ITipoAcoso = ITipoAcoso;
  }

  async obtenerTodos() {
    return await this._ITipoAcoso.obtenerTodos();
  }
}

module.exports = TipoAcosoService;