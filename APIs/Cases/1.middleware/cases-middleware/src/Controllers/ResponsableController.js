const { ApiResponse } = require("@lila/response");
const { NotFoundError } = require("@lila/errors");

class ResponsableController {
  constructor(responsableBusiness) {
    this.responsableBusiness = responsableBusiness;
  }

  async crear(req, res) {
    const data = await this.responsableBusiness.crear(req.body);
    return ApiResponse.created(res, data, "Responsable creado correctamente");
  }

  async obtenerTodos(req, res) {
    return ApiResponse.ok(res, await this.responsableBusiness.obtenerTodos());
  }

  async obtenerPorId(req, res) {
    const responsable = await this.responsableBusiness.obtenerPorId(req.params.id);
    if (!responsable) throw new NotFoundError("Responsable no encontrado");
    return ApiResponse.ok(res, responsable);
  }

  async actualizar(req, res) {
    const responsable = await this.responsableBusiness.actualizar(req.params.id, req.body);
    return ApiResponse.ok(res, responsable, "Responsable actualizado correctamente");
  }

  async eliminar(req, res) {
    await this.responsableBusiness.eliminar(req.params.id);
    return ApiResponse.ok(res, null, "Responsable eliminado correctamente");
  }
}

module.exports = ResponsableController;
