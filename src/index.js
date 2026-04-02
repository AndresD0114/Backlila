// Este archivo define la inicialización principal de Swagger.
// Si la API crece mucho, luego se puede separar la configuración de Swagger
// del arranque del servidor.

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const { sequelize } = require("./Infrastructure/persistence/context");
const UsuarioRepository = require("./Infrastructure/Repository/UsuarioRepository");

// Application
const UsuarioService = require("./Aplication/Services/UsuarioService");

// Presentation
const UsuarioController = require("./Presentation/Controllers/UsuarioController");
const UsuarioRoutes = require("./Presentation/Routes/UsuarioRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Inyección de dependencias
const usuarioRepository = new UsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);
const usuarioController = new UsuarioController(usuarioService);

// Montar rutas
app.use("/api", UsuarioRoutes(usuarioController));

// Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API LILA",
      version: "1.0.0",
      description: "Documentación de la API"
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ]
  },
  apis: ["./src/Presentation/Routes/*.js"]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({ message: "API funcionando" });
});

const PORT = 3000;

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Base de datos conectada");
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Swagger en http://localhost:${PORT}/api-docs`);
  } catch (error) {
    console.error("Error al conectar la base de datos:", error.message);
  }
});