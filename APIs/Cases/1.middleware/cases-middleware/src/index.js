const middleware = require("./Middleware");

module.exports = {
  ...middleware,
  Controllers: require("./Controllers"),
  createSpec: require("./Swagger").createSpec,
  Routers: {
    Caso: require("./Routers/CasoRoutes"),
    Responsable: require("./Routers/ResponsableRoutes"),
    TipoAcoso: require("./Routers/TipoAcosoRoutes"),
    Usuario: require("./Routers/UsuarioRoutes")
  }
};
