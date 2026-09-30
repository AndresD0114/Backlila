const ITipoAcosoRepository = require("../Interface/ITipoAcosoRepository");

const CONSULTAR_TIPOS_ACOSO = "CALL PRC_ConsultarTiposAcoso()";

class TipoAcosoRepository extends ITipoAcosoRepository {
  constructor(model) {
    super();
    this.model = model;
  }

  async obtenerTodos() {
    return await this.model.sequelize.query(CONSULTAR_TIPOS_ACOSO);
  }
}

module.exports = TipoAcosoRepository;
