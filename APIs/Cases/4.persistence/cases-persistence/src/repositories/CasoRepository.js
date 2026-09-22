const { NotFoundError } = require("@lila/errors");
const ICasoRepository = require("../Interface/ICasoRepository");
const writable = ["idUsuario","idTipoAcoso","idResponsable","codigoCaso","pasoInstitucion","descripcion","estado"];
class CasoRepository extends ICasoRepository {
  constructor(model) {
    super();
    this.model = model;
  }
  async crear(data) {
    return this.model.create(Object.fromEntries(writable.filter(key => data[key] !== undefined).map(key => [key, data[key]])));
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
