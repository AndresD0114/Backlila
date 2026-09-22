const { Responsable } = require("../persistence/context");

class ResponsableRepository {

  async crear(responsable) {
    try {
      const nuevo = await Responsable.create({
        nombre: responsable.nombre,
        telefono: responsable.telefono,
        cargo: responsable.cargo,
        correoEmail: responsable.correoEmail,
      });

      return nuevo;
    } catch (error) {
      throw new Error("Error al crear responsable: " + error.message);
    }
  }

  async obtenerPorId(idResponsable) {
    try {
      const responsable = await Responsable.findByPk(idResponsable);
      return responsable;
    } catch (error) {
      throw new Error("Error al obtener responsable por ID: " + error.message);
    }
  }

  async obtenerTodos() {
    try {
      const responsables = await Responsable.findAll();

      return responsables;
    } catch (error) {
      throw new Error("Error al obtener responsables: " + error.message);
    }
  }

  async actualizar(idResponsable, datos) {
    try {
      const responsable = await Responsable.findByPk(idResponsable);

      if (!responsable) {
        throw new Error("Responsable no encontrado");
      }

      await responsable.update(datos);

      return responsable;
    } catch (error) {
      throw new Error("Error al actualizar responsable: " + error.message);
    }
  }

  async eliminar(idResponsable) {
    try {
      const responsable = await Responsable.findByPk(idResponsable);

      if (!responsable) {
        throw new Error("Responsable no encontrado");
      }

      await responsable.update({ estado: "inactivo" });

      return true;
    } catch (error) {
      throw new Error("Error al eliminar responsable: " + error.message);
    }
  }
}

module.exports = ResponsableRepository;