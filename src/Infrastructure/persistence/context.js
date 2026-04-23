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
    logging: false,
    timezone: "-05:00",
    dialectOptions: {
      useUTC: false,
      dateStrings: true,
      typeCast: true
    }
  }
);// =======================
// MODELO USUARIO
// =======================

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


//=======================
// TIPO ACOSO
//=======================


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

//=======================
// Responsable
//=======================

const Responsable = sequelize.define("Responsable", {
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

//=======================
// Caso
//=======================


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
    type: DataTypes.STRING(20),
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

//=======================
// Evidencia
//=======================


const Evidencia = sequelize.define("Evidencia", {
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

module.exports = {
  sequelize,
  Usuario,
  TipoAcoso,
  Responsable,
  Caso,
  Evidencia
};