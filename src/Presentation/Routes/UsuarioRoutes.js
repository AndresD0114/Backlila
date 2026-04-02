const express = require("express");

function UsuarioRoutes(usuarioController) {
  const router = express.Router();

  /**
   * @swagger
   * tags:
   *   name: Usuarios
   *   description: Endpoints de usuarios
   */

  /**
   * @swagger
   * /api/usuarios:
   *   post:
   *     summary: Crear un usuario
   *     tags: [Usuarios]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               telefono:
   *                 type: string
   *               sexo_biologico:
   *                 type: string
   *               orientacion_genero:
   *                 type: string
   *               correo_email:
   *                 type: string
   *               Tipo_usuario:
   *                 type: string
   *     responses:
   *       201:
   *         description: Usuario creado correctamente
   */
  router.post("/usuarios", (req, res) =>
    usuarioController.crear(req, res)
  );

  /**
   * @swagger
   * /api/usuarios:
   *   get:
   *     summary: Obtener todos los usuarios
   *     tags: [Usuarios]
   *     responses:
   *       200:
   *         description: Lista de usuarios
   */
  router.get("/usuarios", (req, res) =>
    usuarioController.obtenerTodos(req, res)
  );

  return router;
}

module.exports = UsuarioRoutes;