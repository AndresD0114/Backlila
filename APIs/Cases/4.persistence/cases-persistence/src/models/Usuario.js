const { Sequelize, DataTypes } = require("sequelize");

module.exports = function defineUsuario(sequelize) {

const Usuario = sequelize.define("Usuario", {
  
  idUsuario: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4 // GUID automático
  },
  cedula: {
    type: DataTypes.STRING,
    defaultValue: null // GUID automático
  },
  
  telefono: {
    type: DataTypes.STRING
  },
  fechaRegistro: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sexoBiologico: {
    type: DataTypes.STRING
  },
  orientacionGenero: {
    type: DataTypes.STRING
  },
  correoEmail: {
    type: DataTypes.STRING,
    unique: true
  },
  deviceId: {
    type: DataTypes.STRING,
    unique: true
  },
  
  tipoUsuario: {
    type: DataTypes.STRING
  }
}, {
  tableName: "usuario",
  timestamps: false
});
return Usuario;
};

