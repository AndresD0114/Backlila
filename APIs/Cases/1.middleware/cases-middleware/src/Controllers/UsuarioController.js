const { ApiResponse } = require("@lila/response");

class UsuarioController {
  constructor(usuarioBusiness) {
    this.usuarioBusiness = usuarioBusiness;
  }

  async crear(req, res) {
    const data = await this.usuarioBusiness.crear(req.body);
    return ApiResponse.created(res, data, "Usuario creado correctamente");
  }

  async obtenerTodos(req, res) {
    return ApiResponse.ok(res, await this.usuarioBusiness.obtenerTodos());
  }
}

module.exports = UsuarioController;
