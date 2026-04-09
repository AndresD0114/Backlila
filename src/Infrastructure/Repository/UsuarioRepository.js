const { Usuario } = require("../persistence/context");

class UsuarioRepository {

  async crear(usuario) {
    try {
      const nuevo = await Usuario.create({
        telefono: usuario.telefono,
        estado: usuario.estado,
        sexo_biologico: usuario.sexo_biologico,
        orientacion_genero: usuario.orientacion_genero,
        correo_email: usuario.correo_email,
        tipo_usuario: usuario.tipo_usuario
      });

      return nuevo;
    } catch (error) {
      throw new Error("Error al crear un usuario: " + error.message);
    }
  }

  async obtenerPorId(id_usuario) {
    try {
      const usuario = await Usuario.findByPk(id_usuario);
      return usuario;
    } catch (error) {
      throw new Error("Error al obtener usuario por ID: " + error.message);
    }
  }

  async obtenerPorCorreo(correo_email) {
    try {
      const usuario = await Usuario.findOne({
        where: { correo_email }
      });
      return usuario;
    } catch (error) {
      throw new Error("Error al obtener usuario por correo: " + error.message);
    }
  }

  async obtenerTodos() {
    try {
      const usuarios = await Usuario.findAll();
      return usuarios;
    } catch (error) {
      throw new Error("Error al obtener usuarios: " + error.message);
    }
  }

  async actualizar(id_usuario, datos) {
    try {
      const usuario = await Usuario.findByPk(id_usuario);

      if (!usuario) {
        throw new Error("Usuario no encontrado");
      }

      await usuario.update(datos);

      return usuario;
    } catch (error) {
      throw new Error("Error al actualizar usuario: " + error.message);
    }
  }

  async eliminar(id_usuario) {
    try {
      const usuario = await Usuario.findByPk(id_usuario);

      if (!usuario) {
        throw new Error("Usuario no encontrado");
      }

      // 🔥 mejor práctica: borrado lógico
      await usuario.update({ estado: false });

      return true;
    } catch (error) {
      throw new Error("Error al eliminar usuario: " + error.message);
    }
  }
}

module.exports = UsuarioRepository;