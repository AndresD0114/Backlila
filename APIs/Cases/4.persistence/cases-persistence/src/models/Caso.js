const { Sequelize, DataTypes } = require("sequelize");
module.exports = function defineCaso(sequelize) {
const Caso = sequelize.define("Caso", {
  idCaso: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  idUsuario: {
    type: DataTypes.UUID,
    allowNull: false
  },
  idTipoAcoso: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idResponsable: {
    type: DataTypes.UUID,
    allowNull: true
  },
  codigoCaso: {
    type: DataTypes.STRING(64),
    unique: true
  },
  pasoInstitucion: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  estado: {
    type: DataTypes.STRING(50)
  },
  fechaReporte: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  fechaActualizacion: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  tableName: "caso",
  timestamps: false
});
return Caso;
};
