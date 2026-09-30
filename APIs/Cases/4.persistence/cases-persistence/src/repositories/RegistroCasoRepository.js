const crypto = require("node:crypto");
const { ConflictError, NotFoundError } = require("@lila/errors");
const IRegistroCasoRepository = require("../Interface/IRegistroCasoRepository");

const REGISTRAR_CASO = `CALL PRC_RegistrarCaso(
  :idUsuario,
  :crearUsuario,
  :cedula,
  :telefono,
  :correoEmail,
  :deviceId,
  :sexoBiologico,
  :orientacionGenero,
  :tipoUsuario,
  :idCaso
)`;

class RegistroCasoRepository extends IRegistroCasoRepository {
  constructor(sequelize, usuarioModel, casoModel, infoAfectadoModel) {
    super();
    this.sequelize = sequelize;
    this.usuarioModel = usuarioModel;
    this.casoModel = casoModel;
    this.infoAfectadoModel = infoAfectadoModel;
  }

  async obtenerUsuarioPorDeviceId(deviceId, options = {}) {
    return this.usuarioModel.findOne({
      where: { deviceId },
      order: [["fechaRegistro", "ASC"], ["idUsuario", "ASC"]],
      ...options
    });
  }

  async obtenerCasoPorId(idCaso, options = {}) {
    return this.casoModel.findByPk(idCaso, options);
  }

  async obtenerInfoAfectadoPorCaso(idCaso, options = {}) {
    return this.infoAfectadoModel.findOne({
      where: { idCaso },
      ...options
    });
  }

  async registrar(registro, { idUsuario }) {
    const { usuario, infoAfectado } = registro;
    const transaction = await this.sequelize.transaction({
      isolationLevel: "READ COMMITTED"
    });
    const caseLockName = `cas:${infoAfectado.idCaso.replaceAll("-", "")}`;
    const deviceLockName = `dev:${crypto
      .createHash("sha256")
      .update(usuario.deviceId)
      .digest("hex")
      .slice(0, 60)}`;
    const acquiredLocks = [];

    const acquireLock = async lockName => {
      const [result] = await this.sequelize.query(
        "SELECT GET_LOCK(:lockName, 10) AS acquired",
        { replacements: { lockName }, transaction }
      );
      if (Number(result[0].acquired) !== 1) {
        throw new Error("No fue posible bloquear el registro");
      }
      acquiredLocks.push(lockName);
    };

    const releaseLocks = async () => {
      while (acquiredLocks.length) {
        const lockName = acquiredLocks.pop();
        await this.sequelize.query("DO RELEASE_LOCK(:lockName)", {
          replacements: { lockName },
          transaction
        }).catch(() => {});
      }
    };

    try {
      await acquireLock(caseLockName);
      await acquireLock(deviceLockName);

      const caso = await this.obtenerCasoPorId(infoAfectado.idCaso, { transaction });
      if (!caso) throw new NotFoundError("El caso indicado no existe", "CASE_NOT_FOUND");

      const infoExistente = await this.obtenerInfoAfectadoPorCaso(
        infoAfectado.idCaso,
        { transaction }
      );
      if (infoExistente) {
        throw new ConflictError("El caso ya tiene información de la persona afectada");
      }

      const usuarioExistente = await this.obtenerUsuarioPorDeviceId(
        usuario.deviceId,
        { transaction }
      );
      const usuarioResuelto = usuarioExistente?.idUsuario || idUsuario;
      const rows = await this.sequelize.query(REGISTRAR_CASO, {
        replacements: {
          idUsuario: usuarioResuelto,
          crearUsuario: !usuarioExistente,
          cedula: usuario.cedula,
          telefono: usuario.telefono,
          correoEmail: usuario.correoEmail,
          deviceId: usuario.deviceId,
          sexoBiologico: infoAfectado.sexoBiologico,
          orientacionGenero: infoAfectado.orientacionGenero,
          tipoUsuario: infoAfectado.tipoUsuario,
          idCaso: infoAfectado.idCaso
        },
        transaction
      });

      await releaseLocks();
      await transaction.commit();
      return rows[0];
    } catch (error) {
      await releaseLocks();
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = RegistroCasoRepository;
