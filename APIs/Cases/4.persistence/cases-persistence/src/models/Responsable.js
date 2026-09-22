const { Sequelize, DataTypes } = require("sequelize");

module.exports = function defineResponsable(sequelize) {
  
const Responsable = sequelize.define("Responsable", {
  estado: { type: DataTypes.STRING(20), defaultValue: "activo", allowNull: false },
  idResponsable: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  cargo: {
    type: DataTypes.STRING(100)
  },
  correoEmail: {
    type: DataTypes.STRING(150),
    field: "correo"
  },
  telefono: {
    type: DataTypes.STRING(20)
  }
}, {
  tableName: "responsable",
  timestamps: false
});
return Responsable;
};

