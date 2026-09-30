class Usuario {
  constructor({
    idUsuario = null,
    cedula = null,
    telefono,
    correoEmail = null,
    estado = true,
    fechaRegistro,
    deviceId
  }) {
    this.idUsuario = idUsuario;
    this.cedula = cedula;
    this.telefono = telefono;
    this.correoEmail = correoEmail;
    this.estado = estado;
    this.fechaRegistro = fechaRegistro;
    this.deviceId = deviceId;
  }

  desactivar() {
    this.estado = false;
  }
}

module.exports = Usuario;
