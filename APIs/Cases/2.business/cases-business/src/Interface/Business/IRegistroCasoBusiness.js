class IRegistroCasoBusiness {
  async registrar(_data) {
    throw new Error("Debe implementar registrar");
  }
}

module.exports = IRegistroCasoBusiness;
