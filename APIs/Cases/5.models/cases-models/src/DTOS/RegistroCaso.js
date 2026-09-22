class RegistroCasoDTO {
    constructor(usuario, infoAfectado) {
        Object.assign(this, usuario, infoAfectado);
    }
}
module.exports = RegistroCasoDTO;