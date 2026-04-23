class CasoController {
  constructor(casoService) {
    this.casoService = casoService;
  }

  // =========================
  // CREAR CASO
  // =========================
  async crear(req, res) {
    try {
      const resultado = await this.casoService.crear(req.body);

      res.status(201).json({
        mensaje: "Caso creado correctamente",
        codigoCaso: resultado.codigoCaso 
      });

    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }

  // =========================
  // OBTENER TODOS
  // =========================
  async obtenerTodos(req, res) {
    try {
      const casos = await this.casoService.obtenerTodos();

      res.status(200).json(casos);

    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }

  // =========================
  // OBTENER POR ID
  // =========================
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;

      const caso = await this.casoService.obtenerPorId(id);

      if (!caso) {
        return res.status(404).json({
          mensaje: "Caso no encontrado"
        });
      }

      res.status(200).json(caso);

    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }

  // =========================
  // OBTENER POR CÓDIGO
  // =========================
  async obtenerPorCodigo(req, res) {
    try {
      const { codigo } = req.params;

      const caso = await this.casoService.obtenerPorCodigo(codigo);

      if (!caso) {
        return res.status(404).json({
          mensaje: "Caso no encontrado"
        });
      }

      res.status(200).json(caso);

    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }

  // =========================
  // ACTUALIZAR
  // =========================
  async actualizar(req, res) {
    try {
      const { id } = req.params;

      const casoActualizado = await this.casoService.actualizar(id, req.body);

      res.status(200).json({
        mensaje: "Caso actualizado correctamente",
        caso: casoActualizado
      });

    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }

  // =========================
  // ELIMINAR (SOFT DELETE)
  // =========================
  async eliminar(req, res) {
    try {
      const { id } = req.params;

      await this.casoService.eliminar(id);

      res.status(200).json({
        mensaje: "Caso eliminado correctamente"
      });

    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }
}

module.exports = CasoController;