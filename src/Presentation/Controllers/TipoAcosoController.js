class TipoAcosoController {
  constructor(tipoAcosoService) {
    this.tipoAcosoService = tipoAcosoService;
  }

  async obtenerTodos(req, res) {
    try {
      const tiposAcoso = await this.tipoAcosoService.obtenerTodos();

      res.json(tiposAcoso);
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener los tipos de acoso",
        error: error.message
      });
    }
  }
}

module.exports = TipoAcosoController;