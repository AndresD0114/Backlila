const Responsable = require("../Entities/Responsable");

class IResponsableRepository {
 
  async crear(responsable) {}
  
  async obtenerPorId(idResponsable) {}

  async obtenerTodos() {}

  async actualizar(idResponsable, datos) {}

  async eliminar(idResponsable) {}
}

module.exports = IResponsableRepository;