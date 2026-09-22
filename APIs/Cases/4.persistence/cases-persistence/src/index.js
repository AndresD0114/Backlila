exports.createContext = require("./context").createContext;
exports.CasoRepository = require("./repositories/CasoRepository");
exports.EvidenciaRepository = require("./repositories/EvidenciaRepository");
exports.ResponsableRepository = require("./repositories/ResponsableRepository");
exports.TipoAcosoRepository = require("./repositories/TipoAcosoRepository");
exports.UsuarioRepository = require("./repositories/UsuarioRepository");

exports.ICasoRepository = require("./Interface/ICasoRepository");
exports.IEvidenciaRepository = require("./Interface/IEvidenciaRepository");
exports.IResponsableRepository = require("./Interface/IResponsableRepository");
exports.ITipoAcosoRepository = require("./Interface/ITipoAcosoRepository");
exports.IUsuarioRepository = require("./Interface/IUsuarioRepository");
