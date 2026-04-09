const express = require("express");

function TipoAcosoRoutes(tipoAcosoController) {
  const router = express.Router();

  /**
   * @swagger
   * tags:
   *   name: TiposAcoso
   *   description: Endpoints de tipos de acoso
   */

  /**
   * @swagger
   * /api/tipos-acoso:
   *   get:
   *     summary: Obtener todos los tipos de acoso
   *     tags: [TiposAcoso]
   *     responses:
   *       200:
   *         description: Lista de tipos de acoso
   */
  router.get("/tipos-acoso", (req, res) =>
    tipoAcosoController.obtenerTodos(req, res)
  );

  return router;
}

module.exports = TipoAcosoRoutes;