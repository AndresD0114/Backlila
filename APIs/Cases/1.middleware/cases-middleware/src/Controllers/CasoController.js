const { ApiResponse } = require("@lila/response");
const { NotFoundError } = require("@lila/errors");

class CasoController {
  constructor(casoBusiness) {
    this.casoBusiness = casoBusiness;
  }

  async crear(req, res) {
    const data = await this.casoBusiness.crear(req.body);
    return ApiResponse.created(res, data, "Caso creado correctamente");
  }

  async obtenerTodos(req, res) {
    return ApiResponse.ok(res, await this.casoBusiness.obtenerTodos());
  }

  async obtenerPorId(req, res) {
    const caso = await this.casoBusiness.obtenerPorId(req.params.id);
    if (!caso) throw new NotFoundError("Caso no encontrado", "CASE_NOT_FOUND");
    return ApiResponse.ok(res, caso);
  }

  async obtenerPorCodigo(req, res) {
    const caso = await this.casoBusiness.obtenerPorCodigo(req.params.codigo);
    if (!caso) throw new NotFoundError("Caso no encontrado", "CASE_NOT_FOUND");
    return ApiResponse.ok(res, caso);
  }

  async actualizar(req, res) {
    const caso = await this.casoBusiness.actualizar(req.params.id, req.body);
    return ApiResponse.ok(res, caso, "Caso actualizado correctamente");
  }

  async eliminar(req, res) {
    await this.casoBusiness.eliminar(req.params.id);
    return ApiResponse.ok(res, null, "Caso eliminado correctamente");
  }
}

module.exports = CasoController;
