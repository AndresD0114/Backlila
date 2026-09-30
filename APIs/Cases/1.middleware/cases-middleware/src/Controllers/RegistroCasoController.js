const { ApiResponse } = require("@lila/response");

class RegistroCasoController {
  constructor(registroCasoBusiness) {
    this.registroCasoBusiness = registroCasoBusiness;
  }

  async registrar(req, res) {
    const data = await this.registroCasoBusiness.registrar(req.body);
    return ApiResponse.created(res, data, "Registro creado correctamente");
  }
}

module.exports = RegistroCasoController;
