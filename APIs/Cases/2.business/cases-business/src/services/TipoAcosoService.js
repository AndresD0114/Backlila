const ITipoAcosoBusiness = require("../Interface/Business/ITipoAcosoBusiness");

class TipoAcosoService extends ITipoAcosoBusiness {
  /**
   * @param {ITipoAcosoRepository} tipoAcosoRepository
   */
  constructor(tipoAcosoRepository) {
    super();
    this.tipoAcosoRepository = tipoAcosoRepository;
  }

  async obtenerTodos() {
    return await this.tipoAcosoRepository.obtenerTodos();
  }
}

module.exports = TipoAcosoService;
