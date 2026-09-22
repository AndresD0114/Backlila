const { Sequelize, DataTypes } = require("sequelize");
const mysql2 = require("mysql2");

function createContext(database) {

// Crear conexión (equivalente a DbContext)
const sequelize = new Sequelize(
  database.database,
  database.user,
  database.password,
  {
    host: database.host,
    port: database.port,
    dialect: "mysql",
    dialectModule: mysql2,
    logging: false,
    timezone: "-05:00",
    dialectOptions: {
      dateStrings: true,
      typeCast: true
    }
  }
);// =======================
// MODELO USUARIO
// =======================

const Usuario = require("./models/Usuario")(sequelize);


//=======================
// TIPO ACOSO
//=======================


const TipoAcoso = require("./models/TipoAcoso")(sequelize);

//=======================
// Responsable
//=======================

const Responsable = require("./models/Responsable")(sequelize);

//=======================
// Caso
//=======================


const Caso = require("./models/Caso")(sequelize);

//=======================
// Evidencia
//=======================


const Evidencia = require("./models/Evidencia")(sequelize);

//========================
// Relaciones
//========================
// Usuario -> Caso
Usuario.hasMany(Caso, { foreignKey: "idUsuario" });
Caso.belongsTo(Usuario, { foreignKey: "idUsuario" });

// TipoAcoso -> Caso
TipoAcoso.hasMany(Caso, { foreignKey: "idTipoAcoso" });
Caso.belongsTo(TipoAcoso, { foreignKey: "idTipoAcoso" });

// Responsable -> Caso
Responsable.hasMany(Caso, { foreignKey: "idResponsable" });
Caso.belongsTo(Responsable, { foreignKey: "idResponsable" });

// Caso -> Evidencia
Caso.hasMany(Evidencia, { foreignKey: "idCaso" });
Evidencia.belongsTo(Caso, { foreignKey: "idCaso" });
// =======================
// EXPORTAR (DbContext)
// =======================

return {
  sequelize,
  Usuario,
  TipoAcoso,
  Responsable,
  Caso,
  Evidencia
};
}
module.exports = { createContext };
