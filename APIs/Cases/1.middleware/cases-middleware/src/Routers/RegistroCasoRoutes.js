const express = require("express");

function RegistroCasoRoutes(registroCasoController) {
  const router = express.Router();

  /**
   * @swagger
   * /api/registro-caso:
   *   post:
   *     summary: Registrar usuario e información de la persona afectada
   *     tags: [Casos]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [usuario, infoAfectado]
   *             properties:
   *               usuario:
   *                 type: object
   *                 required: [deviceId]
   *                 properties:
   *                   cedula:
   *                     type: string
   *                   telefono:
   *                     type: string
   *                   correoEmail:
   *                     type: string
   *                   deviceId:
   *                     type: string
   *               infoAfectado:
   *                 type: object
   *                 required: [idCaso]
   *                 properties:
   *                   sexoBiologico:
   *                     type: string
   *                   orientacionGenero:
   *                     type: string
   *                   tipoUsuario:
   *                     type: string
   *                   idCaso:
   *                     type: string
   *                     format: uuid
   *     responses:
   *       201:
   *         description: Registro creado correctamente
   */
  router.post("/registro-caso", (req, res) =>
    registroCasoController.registrar(req, res)
  );

  return router;
}

module.exports = RegistroCasoRoutes;
