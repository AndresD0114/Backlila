const path = require("node:path");
const dotenv = require("dotenv");
const { loadConfig } = require("./config");
const { createContainer } = require("./dependency-injection");

const DEFAULT_ENV_PATH = path.join(__dirname, "../.env");

function loadEnv(envPath = DEFAULT_ENV_PATH) {
  return dotenv.config({
    path: envPath || DEFAULT_ENV_PATH,
    quiet: true
  });
}

module.exports = {
  loadEnv,
  loadConfig,
  createContainer
};
