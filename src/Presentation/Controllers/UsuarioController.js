class UsuarioController {
  constructor(usuarioService) {
    this.usuarioService = usuarioService;
  }

  async crear(req, res) {
    try {
      const data = req.body;
          console.log("BODY CONTROLLER:", req.body);


      const resultado = await this.usuarioService.crear(data);

      res.status(201).json(resultado);
    } catch (error) {
      res.status(500).json({
        message: "Error al crear usuario",
        error: error.message
      });
    }
  }

  async obtenerTodos(req, res) {
    try {
      const usuarios = await this.usuarioService.obtenerTodos();

      res.json(usuarios);
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener usuarios",
        error: error.message
      });
    }
  }
}

module.exports = UsuarioController;