const Caso = require("../Entities/Caso");

class ICasoRepository {
 
  async crear(caso) {}
  
  async obtenerPorId(idCaso) {}

  async obtenerPorUsuario(idUsuario) {}

  async obtenerPorCodigo(codigoCaso) {}

  async obtenerTodos() {}

  async actualizar(idCaso, datos) {}

  async eliminar(idCaso) {}
}

module.exports = ICasoRepository;