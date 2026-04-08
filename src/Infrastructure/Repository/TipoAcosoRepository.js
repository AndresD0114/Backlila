const { TipoAcoso } = require("../persistence/context");

class TipoAcosoRepository {
  
  async obtenerTodos() {
    try {
      const tiposAcoso = await TipoAcoso.findAll();
      return tiposAcoso;
    } catch (error) {
      throw new Error("Error al obtener los tipos de acoso: " + error.message);
    }
  }

}

module.exports = TipoAcosoRepository;