
// clase que define



class Responsable{
  constructor({
    idResponsable = null, // GUID (lo genera la BD)
    nombre  = null,
    telefono,
    cargo = null,
    correoEmail = null,
    
  }) {

    // validación opcional
    if (correoEmail && typeof correoEmail !== "string") {
      throw new Error("El correo debe ser texto");
    }

    this.idResponsable = idResponsable;
    this.nombre = nombre;
    this.telefono = telefono;
    this.cargo = cargo;
    this.correoEmail = correoEmail;
  }

  
  
}

module.exports = Responsable;