const crypto = require("node:crypto");
const { NotFoundError } = require("@lila/errors");
const IUsuarioRepository = require("../Interface/IUsuarioRepository");
const writable = ["telefono", "cedula", "estado", "correoEmail", "deviceId"];

const REGISTRAR_USUARIO = `CALL PRC_RegistrarUsuario(
  :idUsuario,
  :cedula,
  :telefono,
  :correoEmail,
  :deviceId,
  :estado
)`;

class UsuarioRepository extends IUsuarioRepository {
  constructor(model) {
    super();
    this.model = model;
  }
  async crear(data) {
    const registrarUsuario = async options => {
      await this.model.sequelize.query(REGISTRAR_USUARIO, {
        replacements: {
          idUsuario: data.idUsuario,
          cedula: data.cedula ?? null,
          telefono: data.telefono ?? null,
          correoEmail: data.correoEmail ?? null,
          deviceId: data.deviceId?.trim() || null,
          estado: data.estado ?? true
        },
        ...options
      });

      return await this.obtenerPorId(data.idUsuario, options);
    };

    if (!data.deviceId) return await registrarUsuario({});

    const lockName = `dev:${crypto
      .createHash("sha256")
      .update(data.deviceId.trim())
      .digest("hex")
      .slice(0, 60)}`;
    const transaction = await this.model.sequelize.transaction();
    let lockAcquired = false;

    try {
      const [lockResult] = await this.model.sequelize.query(
        "SELECT GET_LOCK(:lockName, 10) AS acquired",
        { replacements: { lockName }, transaction }
      );
      lockAcquired = Number(lockResult[0].acquired) === 1;

      if (!lockAcquired) {
        throw new Error("No fue posible bloquear el registro del dispositivo");
      }

      const existing = await this.obtenerPorDeviceId(data.deviceId.trim(), {
        transaction
      });
      const result = existing || await registrarUsuario({ transaction });

      await this.model.sequelize.query("DO RELEASE_LOCK(:lockName)", {
        replacements: { lockName },
        transaction
      });
      lockAcquired = false;
      await transaction.commit();
      return result;
    } catch (error) {
      if (lockAcquired) {
        await this.model.sequelize.query("DO RELEASE_LOCK(:lockName)", {
          replacements: { lockName },
          transaction
        }).catch(() => {});
      }
      await transaction.rollback();
      throw error;
    }
  }
  async obtenerTodos() { return this.model.findAll(); }
  async obtenerPorId(id, options = {}) { return this.model.findByPk(id, options); }
  async obtenerPorCorreo(correoEmail) { return this.model.findOne({ where: { correoEmail } }); }
  async obtenerPorDeviceId(deviceId, options = {}) {
    return this.model.findOne({
      where: { deviceId },
      order: [["fechaRegistro", "ASC"], ["idUsuario", "ASC"]],
      ...options
    });
  }
  async requireRecord(id) {
    const record = await this.obtenerPorId(id);
    if (!record) throw new NotFoundError("Usuario no encontrado");
    return record;
  }
  async actualizar(id, data) {
    const record = await this.requireRecord(id);
    const updateFields = writable.filter(key => !["codigoCaso"].includes(key));
    const values = Object.fromEntries(updateFields.filter(key => data[key] !== undefined).map(key => [key, data[key]]));
    
    return record.update(values);
  }
  async eliminar(id) {
    const record = await this.requireRecord(id);
    await record.update({ estado: false });
    return true;
  }
}
module.exports = UsuarioRepository;
