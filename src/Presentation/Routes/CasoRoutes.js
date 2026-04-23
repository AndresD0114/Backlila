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
   *     summary: Crear un caso
   *     tags: [Casos]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               idUsuario:
   *                 type: string
   *               idTipoAcoso:
   *                 type: integer
   *               idResponsable:
   *                 type: string
   *               pasoInstitucion:
   *                 type: boolean
   *               descripcion:
   *                 type: string
   *     responses:
   *       201:
   *         description: Caso creado correctamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 mensaje:
   *                   type: string
   *                 codigoCaso:
   *                   type: string
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