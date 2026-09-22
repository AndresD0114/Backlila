const {
  loadEnv,
  loadConfig,
  createContainer
} = require("@lila/cases-infrastructure");
const { createApp } = require("./app");

const SHUTDOWN_SIGNALS = ["SIGINT", "SIGTERM"];
const SHUTDOWN_TIMEOUT_MS = 10000;

async function connectDatabase(container) {
  try {
    await container.context.sequelize.authenticate();
  } catch (error) {
    await container.close();
    throw error;
  }
}

function createReadinessCheck(container) {
  return () => container.context.sequelize.authenticate();
}

function startHttpServer(app, config) {
  return app.listen(config.port, config.host, () => {
    console.log(`Casos escuchando en ${config.host}:${config.port}`);
  });
}

function registerServerErrorHandler(server, container) {
  server.on("error", async () => {
    await container.close();
    process.exitCode = 1;
  });
}

function registerShutdownHandlers(server, container) {
  for (const signal of SHUTDOWN_SIGNALS) {
    process.once(signal, () => {
      const forceShutdownTimer = setTimeout(
        () => process.exit(1),
        SHUTDOWN_TIMEOUT_MS
      ).unref();

      server.close(async () => {
        await container.close();
        clearTimeout(forceShutdownTimer);
      });
    });
  }
}

async function start() {
  loadEnv(process.env.ENV_FILE);

  const config = loadConfig();
  const container = createContainer(config);

  await connectDatabase(container);

  const app = createApp({
    services: container.services,
    checkReady: createReadinessCheck(container)
  });
  const server = startHttpServer(app, config);

  registerServerErrorHandler(server, container);
  registerShutdownHandlers(server, container);

  return server;
}

if (require.main === module) {
  start().catch(error => {
    console.error(`No se pudo iniciar Casos: ${error.name}`);
    process.exitCode = 1;
  });
}

module.exports = { start };
