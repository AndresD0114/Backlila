const express = require("express");

function EvidenciaRoutes(evidenciaController) {
  const router = express.Router();

  /**
   * @swagger
   * tags:
   *   name: Evidencias
   *   description: Endpoints de evidencias
   */

  /**
   * @swagger
   * /api/evidencias:
   *   post:
   *     summary: Crear una evidencia
   *     tags: [Evidencias]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               idCaso:
   *                 type: string
   *               tipoArchivo:
   *                 type: string
   *               urlArchivo:
   *                 type: string
   *     responses:
   *       201:
   *         description: Evidencia creada correctamente
   */
  router.post("/evidencias", (req, res) =>
    evidenciaController.crear(req, res)
  );

  /**
   * @swagger
   * /api/evidencias:
   *   get:
   *     summary: Obtener todas las evidencias
   *     tags: [Evidencias]
   *     responses:
   *       200:
   *         description: Lista de evidencias
   */
  router.get("/evidencias", (req, res) =>
    evidenciaController.obtenerTodos(req, res)
  );

  /**
   * @swagger
   * /api/evidencias/{id}:
   *   get:
   *     summary: Obtener evidencia por ID
   *     tags: [Evidencias]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Evidencia encontrada
   */
  router.get("/evidencias/:id", (req, res) =>
    evidenciaController.obtenerPorId(req, res)
  );

  /**
   * @swagger
   * /api/evidencias/caso/{idCaso}:
   *   get:
   *     summary: Obtener evidencias por caso
   *     tags: [Evidencias]
   *     parameters:
   *       - in: path
   *         name: idCaso
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Lista de evidencias del caso
   */
  router.get("/evidencias/caso/:idCaso", (req, res) =>
    evidenciaController.obtenerPorCaso(req, res)
  );

  /**
   * @swagger
   * /api/evidencias/{id}:
   *   put:
   *     summary: Actualizar una evidencia
   *     tags: [Evidencias]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               tipoArchivo:
   *                 type: string
   *               urlArchivo:
   *                 type: string
   *     responses:
   *       200:
   *         description: Evidencia actualizada
   */
  router.put("/evidencias/:id", (req, res) =>
    evidenciaController.actualizar(req, res)
  );

  /**
   * @swagger
   * /api/evidencias/{id}:
   *   delete:
   *     summary: Eliminar una evidencia
   *     tags: [Evidencias]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Evidencia eliminada
   */
  router.delete("/evidencias/:id", (req, res) =>
    evidenciaController.eliminar(req, res)
  );

  return router;
}

module.exports = EvidenciaRoutes;