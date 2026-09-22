
// clase que define

class Usuario {
  constructor({
    idUsuario = null, // GUID (lo genera la BD)
    cedula  = null,
    telefono,
    sexoBiologico = null,
    orientacionGenero = null,
    correoEmail = null,
    tipoUsuario,
    estado = true,
    fechaRegistro,
    deviceId
  }) {
    this.idUsuario = idUsuario;
    this.cedula = cedula;
    this.telefono = telefono;
    this.sexoBiologico = sexoBiologico;
    this.orientacionGenero = orientacionGenero;
    this.correoEmail = correoEmail;
    this.tipoUsuario = tipoUsuario ;
    this.estado = estado;
    this.fechaRegistro = fechaRegistro;
    this.deviceId = deviceId;
  }

  desactivar() {
    this.estado = false;
  }
}

module.exports = Usuario;
