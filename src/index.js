const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const { sequelize } = require("./Infrastructure/persistence/context");

// Repositories
const UsuarioRepository = require("./Infrastructure/Repository/UsuarioRepository");
const TipoAcosoRepository = require("./Infrastructure/Repository/TipoAcosoRepository");

// Services
const UsuarioService = require("./Aplication/Services/UsuarioService");
const TipoAcosoService = require("./Aplication/Services/TipoAcosoService");

// Controllers
const UsuarioController = require("./Presentation/Controllers/UsuarioController");
const TipoAcosoController = require("./Presentation/Controllers/TipoAcosoController");

// Routes
const UsuarioRoutes = require("./Presentation/Routes/UsuarioRoutes");
const TipoAcosoRoutes = require("./Presentation/Routes/TipoAcosoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Inyección de dependencias
const usuarioRepository = new UsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);
const usuarioController = new UsuarioController(usuarioService);

const tipoAcosoRepository = new TipoAcosoRepository();
const tipoAcosoService = new TipoAcosoService(tipoAcosoRepository);
const tipoAcosoController = new TipoAcosoController(tipoAcosoService);

// Rutas
app.use("/api", UsuarioRoutes(usuarioController));
app.use("/api", TipoAcosoRoutes(tipoAcosoController));

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

async function iniciarServidor() {
  try {
    await sequelize.authenticate();
    console.log("Base de datos conectada");

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`Swagger en http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Error al conectar la base de datos:", error.message);
  }
}

iniciarServidor();