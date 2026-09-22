const express = require("express");

function ResponsableRoutes(responsableController) {
  const router = express.Router();

  /**
   * @swagger
   * tags:
   *   name: Responsables
   *   description: Endpoints de responsables
   */

  /**
   * @swagger
   * /api/responsables:
   *   post:
   *     summary: Crear un responsable
   *     tags: [Responsables]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nombre:
   *                 type: string
   *               telefono:
   *                 type: string
   *               cargo:
   *                 type: string
   *               correoEmail:
   *                 type: string
   *     responses:
   *       201:
   *         description: Responsable creado correctamente
   */
  router.post("/responsables", (req, res) =>
    responsableController.crear(req, res)
  );

  /**
   * @swagger
   * /api/responsables:
   *   get:
   *     summary: Obtener todos los responsables
   *     tags: [Responsables]
   *     responses:
   *       200:
   *         description: Lista de responsables
   */
  router.get("/responsables", (req, res) =>
    responsableController.obtenerTodos(req, res)
  );

  /**
   * @swagger
   * /api/responsables/{id}:
   *   get:
   *     summary: Obtener responsable por ID
   *     tags: [Responsables]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Responsable encontrado
   */
  router.get("/responsables/:id", (req, res) =>
    responsableController.obtenerPorId(req, res)
  );

  /**
   * @swagger
   * /api/responsables/{id}:
   *   put:
   *     summary: Actualizar un responsable
   *     tags: [Responsables]
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
   *               nombre:
   *                 type: string
   *               telefono:
   *                 type: string
   *               cargo:
   *                 type: string
   *               correoEmail:
   *                 type: string
   *     responses:
   *       200:
   *         description: Responsable actualizado
   */
  router.put("/responsables/:id", (req, res) =>
    responsableController.actualizar(req, res)
  );

  /**
   * @swagger
   * /api/responsables/{id}:
   *   delete:
   *     summary: Eliminar un responsable (soft delete)
   *     tags: [Responsables]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Responsable eliminado
   */
  router.delete("/responsables/:id", (req, res) =>
    responsableController.eliminar(req, res)
  );

  return router;
}

module.exports = ResponsableRoutes;