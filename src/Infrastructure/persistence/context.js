const { Sequelize, DataTypes } = require("sequelize");
const config = require("../../appsettings.json");

// Crear conexión (equivalente a DbContext)
const sequelize = new Sequelize(
  config.database.database,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: "mysql",
    logging: false
  }
);

// =======================
// MODELO USUARIO
// =======================

const Usuario = sequelize.define("Usuario", {
  id_usuario: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4 // GUID automático
  },
  telefono: {
    type: DataTypes.STRING
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sexo_biologico: {
    type: DataTypes.STRING
  },
  orientacion_genero: {
    type: DataTypes.STRING
  },
  correo_email: {
    type: DataTypes.STRING,
    unique: true
  },
  tipo_usuario: {
    type: DataTypes.STRING
  }
}, {
  tableName: "usuario",
  timestamps: false
});


// =======================
// EXPORTAR (DbContext)
// =======================

module.exports = {
  sequelize,
  Usuario
};