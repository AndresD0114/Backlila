class ResponsableController {
  constructor(responsableRepository) {
    this.responsableRepository = responsableRepository;
  }

  async crear(req, res) {
    try {
      const responsable = await this.responsableRepository.crear(req.body);
            console.log("BODY:", req.body);

      return res.status(201).json(responsable);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async obtenerTodos(req, res) {
    try {
      const responsables = await this.responsableRepository.obtenerTodos();
      return res.status(200).json(responsables);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const responsable = await this.responsableRepository.obtenerPorId(id);

      if (!responsable) {
        return res.status(404).json({ error: "Responsable no encontrado" });
      }

      return res.status(200).json(responsable);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const responsable = await this.responsableRepository.actualizar(id, req.body);

      return res.status(200).json(responsable);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      await this.responsableRepository.eliminar(id);

      return res.status(200).json({ message: "Responsable eliminado correctamente" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ResponsableController;