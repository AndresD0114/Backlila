class InfoAfectado {
  constructor({
    idInfoAfectado = null,
    sexoBiologico = null,
    orientacionGenero = null,
    tipoUsuario,
    idCaso
      }) {
    this.idInfoAfectado = idInfoAfectado;
    this.sexoBiologico = sexoBiologico;
    this.orientacionGenero = orientacionGenero;
    this.tipoUsuario = tipoUsuario ;
    this.idCaso = idCaso;

  }
}
module.exports = InfoAfectado;