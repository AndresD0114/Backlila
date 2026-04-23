const Responsable = require("../../Domain/Entities/Responsable");
const IResponsable = require("../../Domain/Interfaces/IResponsable");

class ResponsableService {
  /**
   * @param {IResponsable} _IResponsable
   */
  constructor(IResponsable) {
    this._IResponsable = IResponsable;
  }

  async crear(data) {
    const responsable = new Responsable({
    nombre: data.nombre,
    telefono: data.telefono,
    cargo: data.cargo,
    correoEmail: data.correoEmail
    });



    return await this._IResponsable.crear(responsable);
  }
  
  async obtenerPorId(idResponsable) {
    return await this._IResponsable.obtenerPorId(idResponsable);
  }

  async obtenerTodos() {
        return await this._IResponsable.obtenerTodos();
  }

  async actualizar(idCaso, datos) {
        return await this._IResponsable.actualizar(idCaso, datos);
  }

  async eliminar(idCaso) {
        return await this._IResponsable.eliminar(idCaso);

  }

  
}

module.exports = ResponsableService;