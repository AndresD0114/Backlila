const { Sequelize, DataTypes } = require("sequelize");

module.exports = function defineEvidencia(sequelize) {
  
const Evidencia = sequelize.define("Evidencia", {
  estado: { type: DataTypes.STRING(20), defaultValue: "activo", allowNull: false },
  idEvidencia: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  idCaso: {
    type: DataTypes.UUID,
    allowNull: false
  },
  tipoArchivo: {
    type: DataTypes.STRING(50)
  },
  urlArchivo: {
    type: DataTypes.TEXT
  },
  fechaSubida: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  tableName: "evidencia",
  timestamps: false
});
return Evidencia;
};

