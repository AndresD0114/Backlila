const express = require("express");

function CasoRoutes(casoController) {
  const router = express.Router();

  /**
   * @swagger
   * tags:
   *   name: Casos
   *   description: Endpoints de casos
   */

  /**
   * @swagger
   * /api/casos:
   *   post:
   *     summary: Registrar un caso y la información de la persona afectada
   *     tags: [Casos]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [usuario, idTipoAcoso, infoAfectado]
   *             properties:
   *               idUsuario:
   *                 type: string
   *                 format: uuid
   *                 description: UUID previamente asignado; se ignora si el deviceId ya existe
   *               usuario:
   *                 type: object
   *                 required: [deviceId]
   *                 properties:
   *                   idUsuario:
   *                     type: string
   *                     format: uuid
   *                   cedula:
   *                     type: string
   *                   telefono:
   *                     type: string
   *                   correoEmail:
   *                     type: string
   *                   deviceId:
   *                     type: string
   *               idTipoAcoso:
   *                 type: integer
   *               idResponsable:
   *                 type: string
   *               pasoInstitucion:
   *                 type: boolean
   *               descripcion:
   *                 type: string
   *               infoAfectado:
   *                 type: object
   *                 properties:
   *                   sexoBiologico:
   *                     type: string
   *                   orientacionGenero:
   *                     type: string
   *                   tipoUsuario:
   *                     type: string
   *     responses:
   *       201:
   *         description: Caso registrado correctamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 mensaje:
   *                   type: string
   *                 codigoCaso:
   *                   type: string
   *                 idCaso:
   *                   type: string
   *                   format: uuid
   */
  router.post("/casos", (req, res) =>
    casoController.crear(req, res)
  );

  /**
   * @swagger
   * /api/casos:
   *   get:
   *     summary: Obtener todos los casos
   *     tags: [Casos]
   *     responses:
   *       200:
   *         description: Lista de casos
   */
  router.get("/casos", (req, res) =>
    casoController.obtenerTodos(req, res)
  );

  /**
   * @swagger
   * /api/casos/{id}:
   *   get:
   *     summary: Obtener caso por ID
   *     tags: [Casos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Caso encontrado
   */
  router.get("/casos/:id", (req, res) =>
    casoController.obtenerPorId(req, res)
  );

  /**
   * @swagger
   * /api/casos/codigo/{codigo}:
   *   get:
   *     summary: Obtener caso por código
   *     tags: [Casos]
   *     parameters:
   *       - in: path
   *         name: codigo
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Caso encontrado por código
   */
  router.get("/casos/codigo/:codigo", (req, res) =>
    casoController.obtenerPorCodigo(req, res)
  );

  /**
   * @swagger
   * /api/casos/{id}:
   *   put:
   *     summary: Actualizar caso
   *     tags: [Casos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Caso actualizado
   */
  router.put("/casos/:id", (req, res) =>
    casoController.actualizar(req, res)
  );

  /**
   * @swagger
   * /api/casos/{id}:
   *   delete:
   *     summary: Eliminar caso (soft delete)
   *     tags: [Casos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Caso eliminado
   */
  router.delete("/casos/:id", (req, res) =>
    casoController.eliminar(req, res)
  );

  return router;
}

module.exports = CasoRoutes;
