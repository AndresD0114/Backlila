class IRegistroCasoRepository {
  async obtenerUsuarioPorDeviceId(_deviceId) {
    throw new Error("Debe implementar obtenerUsuarioPorDeviceId");
  }

  async obtenerCasoPorId(_idCaso) {
    throw new Error("Debe implementar obtenerCasoPorId");
  }

  async obtenerInfoAfectadoPorCaso(_idCaso) {
    throw new Error("Debe implementar obtenerInfoAfectadoPorCaso");
  }

  async registrar(_registro, _opciones) {
    throw new Error("Debe implementar registrar");
  }
}

module.exports = IRegistroCasoRepository;
