const { Usuario } = require("../persistence/context");

class UsuarioRepository {

  async crear(usuario) {
    try {
      const nuevo = await Usuario.create({
        telefono: usuario.telefono,
        cedula: usuario.cedula,
        estado: usuario.estado,
        sexoBiologico: usuario.sexoBiologico,
        orientacionGenero: usuario.orientacionGenero,
        correoEmail: usuario.correoEmail,
        tipoUsuario: usuario.tipoUsuario,
        deviceId: usuario.deviceId
      });

      return nuevo;
    } catch (error) {
      throw new Error("Error al crear un usuario: " + error.message);
    }
  }

  async obtenerPorId(idUsuario) {
    try {
      const usuario = await Usuario.findByPk(idUsuario);
      return usuario;
    } catch (error) {
      throw new Error("Error al obtener usuario por ID: " + error.message);
    }
  }

  async obtenerPorCorreo(correoEmail) {
    try {
      const usuario = await Usuario.findOne({
        where: { correoEmail }
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

  async actualizar(idUsuario, datos) {
    try {
      const usuario = await Usuario.findByPk(idUsuario);

      if (!usuario) {
        throw new Error("Usuario no encontrado");
      }

      await usuario.update(datos);

      return usuario;
    } catch (error) {
      throw new Error("Error al actualizar usuario: " + error.message);
    }
  }

  async eliminar(idUsuario) {
    try {
      const usuario = await Usuario.findByPk(idUsuario);

      if (!usuario) {
        throw new Error("Usuario no encontrado");
      }

      await usuario.update({ estado: false });

      return true;
    } catch (error) {
      throw new Error("Error al eliminar usuario: " + error.message);
    }
  }
}

module.exports = UsuarioRepository;