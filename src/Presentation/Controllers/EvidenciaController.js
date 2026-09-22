class EvidenciaController {
  constructor(evidenciaRepository) {
    this.evidenciaRepository = evidenciaRepository;
  }

  async crear(req, res) {
    try {
      const evidencia = await this.evidenciaRepository.crear(req.body);
      return res.status(201).json(evidencia);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerTodos(req, res) {
    try {
      const evidencias = await this.evidenciaRepository.obtenerTodos();
      return res.status(200).json(evidencias);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const evidencia = await this.evidenciaRepository.obtenerPorId(id);

      if (!evidencia) {
        return res.status(404).json({ error: "Evidencia no encontrada" });
      }

      return res.status(200).json(evidencia);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async obtenerPorCaso(req, res) {
    try {
      const { idCaso } = req.params;
      const evidencias = await this.evidenciaRepository.obtenerPorCaso(idCaso);

      return res.status(200).json(evidencias);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const evidencia = await this.evidenciaRepository.actualizar(id, req.body);

      return res.status(200).json(evidencia);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      await this.evidenciaRepository.eliminar(id);

      return res.status(200).json({ message: "Evidencia eliminada correctamente" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = EvidenciaController;