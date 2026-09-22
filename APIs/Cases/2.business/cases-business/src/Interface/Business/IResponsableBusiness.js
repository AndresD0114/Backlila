class IResponsableBusiness {
  async crear(data) {
     throw new Error("Debe implementar crear");
     }

  async obtenerPorId(idResponsable) { 
    throw new Error("Debe implementar obtenerPorId");
   }

  async obtenerTodos() {
     throw new Error("Debe implementar obtenerTodos"); 
    }
  async actualizar(idResponsable, datos) { 
    throw new Error("Debe implementar actualizar");
   }
  async eliminar(idResponsable) {
     throw new Error("Debe implementar eliminar"); 
    }
}

module.exports = IResponsableBusiness;
