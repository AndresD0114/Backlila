const crypto = require("node:crypto");
const { NotFoundError } = require("@lila/errors");
const ICasoRepository = require("../Interface/ICasoRepository");
const writable = ["idUsuario","idTipoAcoso","idResponsable","codigoCaso","pasoInstitucion","descripcion","estado"];

const REGISTRAR_USUARIO = `CALL PRC_RegistrarUsuario(
  :idUsuario,
  :cedula,
  :telefono,
  :correoEmail,
  :deviceId,
  :estado
)`;

const REGISTRAR_CASO = `CALL PRC_RegistrarCaso(
  :idCaso,
  :idUsuario,
  :idTipoAcoso,
  :idResponsable,
  :codigoCaso,
  :pasoInstitucion,
  :descripcion,
  :estado
)`;

const REGISTRAR_INFO_AFECTADO = `CALL PRC_RegistrarInfoAfectado(
  :sexoBiologico,
  :orientacionGenero,
  :tipoUsuario,
  :idCaso
)`;

class CasoRepository extends ICasoRepository {
  constructor(sequelize, model, usuarioModel) {
    super();
    this.sequelize = sequelize;
    this.model = model;
    this.usuarioModel = usuarioModel;
  }

  async crear(registro) {
    const { usuario, caso, infoAfectado } = registro;
    const transaction = await this.sequelize.transaction({
      isolationLevel: "READ COMMITTED"
    });
    const deviceLockName = `dev:${crypto
      .createHash("sha256")
      .update(usuario.deviceId)
      .digest("hex")
      .slice(0, 60)}`;
    let lockAcquired = false;

    try {
      const [lockResult] = await this.sequelize.query(
        "SELECT GET_LOCK(:lockName, 10) AS acquired",
        { replacements: { lockName: deviceLockName }, transaction }
      );
      lockAcquired = Number(lockResult[0].acquired) === 1;
      if (!lockAcquired) {
        throw new Error("No fue posible bloquear el registro del dispositivo");
      }

      const usuarioExistente = await this.usuarioModel.findOne({
        where: { deviceId: usuario.deviceId },
        order: [["fechaRegistro", "ASC"], ["idUsuario", "ASC"]],
        transaction
      });
      const idUsuario = usuarioExistente?.idUsuario || usuario.idUsuario;

      if (!usuarioExistente) {
        await this.sequelize.query(REGISTRAR_USUARIO, {
          replacements: {
            idUsuario,
            cedula: usuario.cedula,
            telefono: usuario.telefono,
            correoEmail: usuario.correoEmail,
            deviceId: usuario.deviceId,
            estado: usuario.estado ?? true
          },
          transaction
        });
      }

      await this.sequelize.query(REGISTRAR_CASO, {
        replacements: {
          idCaso: caso.idCaso,
          idUsuario,
          idTipoAcoso: caso.idTipoAcoso,
          idResponsable: caso.idResponsable ?? null,
          codigoCaso: caso.codigoCaso,
          pasoInstitucion: caso.pasoInstitucion ?? false,
          descripcion: caso.descripcion ?? null,
          estado: caso.estado ?? "pendiente"
        },
        transaction
      });

      const infoRows = await this.sequelize.query(REGISTRAR_INFO_AFECTADO, {
        replacements: {
          sexoBiologico: infoAfectado.sexoBiologico,
          orientacionGenero: infoAfectado.orientacionGenero,
          tipoUsuario: infoAfectado.tipoUsuario,
          idCaso: caso.idCaso
        },
        transaction
      });

      await this.sequelize.query("DO RELEASE_LOCK(:lockName)", {
        replacements: { lockName: deviceLockName },
        transaction
      });
      lockAcquired = false;
      await transaction.commit();
      return {
        idCaso: caso.idCaso,
        idUsuario,
        InfoAfectadoID: infoRows[0]?.InfoAfectadoID ?? null,
        UsuarioCreado: !usuarioExistente
      };
    } catch (error) {
      if (lockAcquired) {
        await this.sequelize.query("DO RELEASE_LOCK(:lockName)", {
          replacements: { lockName: deviceLockName },
          transaction
        }).catch(() => {});
      }
      await transaction.rollback();
      throw error;
    }
  }
  async obtenerTodos() { return this.model.findAll(); }
  async obtenerPorId(id) { return this.model.findByPk(id); }
  async obtenerPorUsuario(idUsuario) { return this.model.findAll({ where: { idUsuario } }); }
  async obtenerPorCodigo(codigoCaso) { return this.model.findOne({ where: { codigoCaso } }); }
  async requireRecord(id) {
    const record = await this.obtenerPorId(id);
    if (!record) throw new NotFoundError("Caso no encontrado");
    return record;
  }
  async actualizar(id, data) {
    const record = await this.requireRecord(id);
    const updateFields = writable.filter(key => !["codigoCaso"].includes(key));
    const values = Object.fromEntries(updateFields.filter(key => data[key] !== undefined).map(key => [key, data[key]]));
    values.fechaActualizacion = new Date();
    return record.update(values);
  }
  async eliminar(id) {
    const record = await this.requireRecord(id);
    await record.update({ estado: "inactivo" });
    return true;
  }
}
module.exports = CasoRepository;
