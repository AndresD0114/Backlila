const ITipoAcosoRepository = require("../Interface/ITipoAcosoRepository");

class TipoAcosoRepository extends ITipoAcosoRepository {
  constructor(model) {
    super();
    this.model = model;
  }
  async obtenerTodos() { return this.model.findAll(); }
}
module.exports = TipoAcosoRepository;
