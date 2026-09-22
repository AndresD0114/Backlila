const path = require("node:path");
const dotenv = require("dotenv");
const { loadConfig } = require("@lila/gateway-model");
const { createApp } = require("./app");

function start() {
  dotenv.config({ path: process.env.ENV_FILE || path.join(__dirname, "../.env"), quiet: true });
  const config = loadConfig();
  const server = createApp(config).listen(config.port, config.host, () => {
    console.log("Gateway escuchando en " + config.host + ":" + config.port);
  });
  server.on("error", error => {
    console.error("No se pudo iniciar Gateway: " + error.code);
    process.exitCode = 1;
  });
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.once(signal, () => {
      const timer = setTimeout(() => process.exit(1), 10000).unref();
      server.close(() => clearTimeout(timer));
    });
  }
  return server;
}

if (require.main === module) {
  try {
    start();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { start };

