const { Usuario } = require("../persistence/context")

class UsuarioRepository {
  
  async crear(usuario) {
    const nuevo =
    await Usuario.create({
      telefono: usuario.telefono,
      estado: usuario.estado,
      sexo_biologico: usuario.sexo_biologico,
      orientacion_genero: usuario.orientacion_genero,
      correo_email: usuario.correo_email,
      tipo_usuario: usuario.tipo_usuario
    });

    return nuevo;
  }
}

module.exports = UsuarioRepository;