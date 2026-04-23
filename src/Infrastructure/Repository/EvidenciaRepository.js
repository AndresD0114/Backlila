const { Evidencia } = require("../persistence/context");

class EvidenciaRepository {

  async crear(evidencia) {
    try {
      const nueva = await Evidencia.create({
        idCaso: evidencia.idCaso,
        tipoArchivo: evidencia.tipoArchivo,
        urlArchivo: evidencia.urlArchivo
      });

      return nueva;
    } catch (error) {
      throw new Error("Error al crear evidencia: " + error.message);
    }
  }

  async obtenerPorId(idEvidencia) {
    try {
      const evidencia = await Evidencia.findByPk(idEvidencia);
      return evidencia;
    } catch (error) {
      throw new Error("Error al obtener evidencia por ID: " + error.message);
    }
  }

  async obtenerPorCaso(idCaso) {
    try {
      const evidencias = await Evidencia.findAll({
        where: { idCaso }
      });

      return evidencias;
    } catch (error) {
      throw new Error("Error al obtener evidencias por caso: " + error.message);
    }
  }

  async obtenerTodos() {
    try {
      const evidencias = await Evidencia.findAll();
      return evidencias;
    } catch (error) {
      throw new Error("Error al obtener evidencias: " + error.message);
    }
  }

  async actualizar(idEvidencia, datos) {
    try {
      const evidencia = await Evidencia.findByPk(idEvidencia);

      if (!evidencia) {
        throw new Error("Evidencia no encontrada");
      }

      await evidencia.update(datos);

      return evidencia;
    } catch (error) {
      throw new Error("Error al actualizar evidencia: " + error.message);
    }
  }

  async eliminar(idEvidencia) {
    try {
      const evidencia = await Evidencia.findByPk(idEvidencia);

      if (!evidencia) {
        throw new Error("Evidencia no encontrada");
      }

      // Soft delete (igual que caso)
      await evidencia.update({ estado: "inactivo" });

      return true;
    } catch (error) {
      throw new Error("Error al eliminar evidencia: " + error.message);
    }
  }
}

module.exports = EvidenciaRepository;