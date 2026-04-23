const { Caso } = require("../persistence/context");

class CasoRepository {

  async crear(caso) {
    try {
      const nuevo = await Caso.create({
        idUsuario: caso.idUsuario,
        idTipoAcoso: caso.idTipoAcoso,
        idResponsable: caso.idResponsable,
        codigoCaso: caso.codigoCaso,
        pasoInstitucion: caso.pasoInstitucion,
        descripcion: caso.descripcion,
        estado: caso.estado
      });

      return nuevo;
    } catch (error) {
      throw new Error("Error al crear el caso: " + error.message);
    }
  }

  async obtenerPorId(idCaso) {
    try {
      const caso = await Caso.findByPk(idCaso);
      return caso;
    } catch (error) {
      throw new Error("Error al obtener caso por ID: " + error.message);
    }
  }

  async obtenerPorUsuario(idUsuario) {
    try {
      const casos = await Caso.findAll({
        where: { idUsuario }
      });

      return casos;
    } catch (error) {
      throw new Error("Error al obtener casos por usuario: " + error.message);
    }
  }

  // 🔥 CLAVE PARA TU LÓGICA
  async obtenerPorCodigo(codigoCaso) {
    try {
      const caso = await Caso.findOne({
        where: { codigoCaso }
      });

      return caso;
    } catch (error) {
      throw new Error("Error al obtener caso por código: " + error.message);
    }
  }

  async obtenerTodos() {
    try {
      const casos = await Caso.findAll();
      return casos;
    } catch (error) {
      throw new Error("Error al obtener casos: " + error.message);
    }
  }

  async actualizar(idCaso, datos) {
    try {
      const caso = await Caso.findByPk(idCaso);

      if (!caso) {
        throw new Error("Caso no encontrado");
      }

      await caso.update(datos);

      return caso;
    } catch (error) {
      throw new Error("Error al actualizar caso: " + error.message);
    }
  }

  async eliminar(idCaso) {
    try {
      const caso = await Caso.findByPk(idCaso);

      if (!caso) {
        throw new Error("Caso no encontrado");
      }

      // Soft delete (igual que usuario)
      await caso.update({ estado: "inactivo" });

      return true;
    } catch (error) {
      throw new Error("Error al eliminar caso: " + error.message);
    }
  }
}

module.exports = CasoRepository;