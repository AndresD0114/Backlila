const { Sequelize, DataTypes } = require("sequelize");

module.exports = function defineTipoAcoso(sequelize) {
  
const TipoAcoso = sequelize.define("TipoAcoso", {
  idTipoAcoso: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: "tipoAcoso",
  timestamps: false
});
return TipoAcoso;
};

