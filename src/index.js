const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const { sequelize } = require("./Infrastructure/persistence/context");

// Repositories
const UsuarioRepository = require("./Infrastructure/Repository/UsuarioRepository");
const TipoAcosoRepository = require("./Infrastructure/Repository/TipoAcosoRepository");
const CasoRepository = require("./Infrastructure/Repository/CasoRepository");
const EvidenciaRepository = require("./Infrastructure/Repository/EvidenciaRepository");
const ResponsableRepository = require("./Infrastructure/Repository/ResponsableRepository");



// Services
const UsuarioService = require("./Aplication/Services/UsuarioService");
const TipoAcosoService = require("./Aplication/Services/TipoAcosoService");
const CasoService = require("./Aplication/Services/CasoService");
const EvidenciaService = require("./Aplication/Services/EvidenciaService");
const ResponsableService = require("./Aplication/Services/ResponsableService");


// Controllers
const UsuarioController = require("./Presentation/Controllers/UsuarioController");
const TipoAcosoController = require("./Presentation/Controllers/TipoAcosoController");
const CasoController = require("./Presentation/Controllers/CasoController");
const EvidenciaController = require("./Presentation/Controllers/EvidenciaController");
const ResponsableController = require("./Presentation/Controllers/ResponsableController");



// Routes
const UsuarioRoutes = require("./Presentation/Routes/UsuarioRoutes");
const TipoAcosoRoutes = require("./Presentation/Routes/TipoAcosoRoutes");
const CasoRoutes = require("./Presentation/Routes/CasoRoutes");
const EvidenciaRoutes = require("./Presentation/Routes/EvidenciaRoutes");
const ResponsableRoutes = require("./Presentation/Routes/ResponsableRoutes");


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

const casoRepository = new CasoRepository();
const casoService = new CasoService(casoRepository);
const casoController = new CasoController(casoService);

const evidenciaRepository = new EvidenciaRepository();
const evidenciaService = new EvidenciaService(evidenciaRepository);
const evidenciaController = new EvidenciaController(evidenciaService);

const responsableRepository = new ResponsableRepository();
const responsableService = new ResponsableService(responsableRepository);
const responsableController = new ResponsableController(responsableService);

// Rutas
app.use("/api", UsuarioRoutes(usuarioController));
app.use("/api", TipoAcosoRoutes(tipoAcosoController));
app.use("/api", CasoRoutes(casoController));
app.use("/api", EvidenciaRoutes(evidenciaController));
app.use("/api", ResponsableRoutes(responsableController));


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
  console.error("💥 ERROR REAL BD:", error);
}
}

iniciarServidor();