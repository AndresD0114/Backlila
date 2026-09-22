
// clase que define



class Responsable{
  constructor({
    idResponsable = null, // GUID (lo genera la BD)
    nombre  = null,
    telefono,
    cargo = null,
    correoEmail = null,
    
  }) {
    this.idResponsable = idResponsable;
    this.nombre = nombre;
    this.telefono = telefono;
    this.cargo = cargo;
    this.correoEmail = correoEmail;
  }

  
  
}

module.exports = Responsable;
