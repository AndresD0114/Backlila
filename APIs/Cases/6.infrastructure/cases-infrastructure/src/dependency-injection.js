const persistence = require("@lila/cases-persistence");
const business = require("@lila/cases-business");

function createContainer(config) {
  const context = persistence.createContext(config.database);

  const repositories = {
    Caso: new persistence.CasoRepository(context.Caso),
    Evidencia: new persistence.EvidenciaRepository(context.Evidencia),
    Responsable: new persistence.ResponsableRepository(context.Responsable),
    TipoAcoso: new persistence.TipoAcosoRepository(context.TipoAcoso),
    Usuario: new persistence.UsuarioRepository(context.Usuario)
  };

  const services = {
    Caso: new business.CasoService(repositories.Caso),
    Evidencia: new business.EvidenciaService(repositories.Evidencia),
    Responsable: new business.ResponsableService(repositories.Responsable),
    TipoAcoso: new business.TipoAcosoService(repositories.TipoAcoso),
    Usuario: new business.UsuarioService(repositories.Usuario)
  };

  return {
    context,
    repositories,
    services,
    close: () => context.sequelize.close()
  };
}

module.exports = { createContainer };
