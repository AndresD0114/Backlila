const { ApiResponse } = require("@lila/response");
const { NotFoundError } = require("@lila/errors");

class EvidenciaController {
  constructor(evidenciaBusiness) {
    this.evidenciaBusiness = evidenciaBusiness;
  }

  async crear(req, res) {
    const data = await this.evidenciaBusiness.crear(req.body);
    return ApiResponse.created(res, data, "Evidencia creada correctamente");
  }

  async obtenerTodos(req, res) {
    return ApiResponse.ok(res, await this.evidenciaBusiness.obtenerTodos());
  }

  async obtenerPorId(req, res) {
    const evidencia = await this.evidenciaBusiness.obtenerPorId(req.params.id);
    if (!evidencia) throw new NotFoundError("Evidencia no encontrada");
    return ApiResponse.ok(res, evidencia);
  }

  async obtenerPorCaso(req, res) {
    return ApiResponse.ok(res, await this.evidenciaBusiness.obtenerPorCaso(req.params.idCaso));
  }

  async actualizar(req, res) {
    const evidencia = await this.evidenciaBusiness.actualizar(req.params.id, req.body);
    return ApiResponse.ok(res, evidencia, "Evidencia actualizada correctamente");
  }

  async eliminar(req, res) {
    await this.evidenciaBusiness.eliminar(req.params.id);
    return ApiResponse.ok(res, null, "Evidencia eliminada correctamente");
  }
}

module.exports = EvidenciaController;
