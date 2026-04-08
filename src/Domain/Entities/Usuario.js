
// clase que define



class Usuario {
  constructor({
    id_usuario = null, // GUID (lo genera la BD)
    telefono,
    sexo_biologico = null,
    orientacion_genero = null,
    correo_email = null,
    tipo_usuario,
    estado = true,
    fecha_registro
  }) {

    // validación opcional
    if (correo_email && typeof correo_email !== "string") {
      throw new Error("El correo debe ser texto");
    }

    this.id_usuario = id_usuario;
    this.telefono = telefono;
    this.sexo_biologico = sexo_biologico;
    this.orientacion_genero = orientacion_genero;
    this.correo_email = correo_email;
    this.tipo_usuario = tipo_usuario ;
    this.estado = estado;
    this.fecha_registro = fecha_registro;
  }

  desactivar() {
    this.estado = false;
  }
}

module.exports = Usuario;