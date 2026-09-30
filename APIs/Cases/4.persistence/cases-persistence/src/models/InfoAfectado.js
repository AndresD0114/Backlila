const { DataTypes } = require("sequelize");

module.exports = function defineInfoAfectado(sequelize) {
  return sequelize.define("InfoAfectado", {
    idInfoAfectado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sexoBiologico: {
      type: DataTypes.STRING(20)
    },
    orientacionGenero: {
      type: DataTypes.STRING(50)
    },
    tipoUsuario: {
      type: DataTypes.STRING(30)
    },
    idCaso: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: "InfoAfectado",
    timestamps: false
  });
};
