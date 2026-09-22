const { ApiResponse } = require("@lila/response");

class TipoAcosoController {
  constructor(tipoAcosoBusiness) {
    this.tipoAcosoBusiness = tipoAcosoBusiness;
  }

  async obtenerTodos(req, res) {
    return ApiResponse.ok(res, await this.tipoAcosoBusiness.obtenerTodos());
  }
}

module.exports = TipoAcosoController;
