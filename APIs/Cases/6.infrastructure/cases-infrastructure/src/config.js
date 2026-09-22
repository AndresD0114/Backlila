const DEFAULT_API_PORT = 3001;
const DEFAULT_API_HOST = "127.0.0.1";
const DEFAULT_DATABASE_PORT = 3306;
const DEFAULT_DATABASE_HOST = "localhost";

function parsePort(value, variableName) {
  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`${variableName} inválido`);
  }

  return port;
}

function validateDatabaseEnvironment(env) {
  const missingDatabaseConfig =
    !env.DB_NAME ||
    !env.DB_USER ||
    env.DB_PASSWORD === undefined;

  if (missingDatabaseConfig) {
    throw new Error(
      "Configure DB_NAME, DB_USER y DB_PASSWORD en el entorno"
    );
  }
}

function createDatabaseConfig(env) {
  validateDatabaseEnvironment(env);

  return {
    host: env.DB_HOST || DEFAULT_DATABASE_HOST,
    port: parsePort(env.DB_PORT || DEFAULT_DATABASE_PORT, "DB_PORT"),
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD
  };
}

function loadConfig(env = process.env) {
  return {
    host: env.CASES_HOST || DEFAULT_API_HOST,
    port: parsePort(env.CASES_PORT || DEFAULT_API_PORT, "CASES_PORT"),
    database: createDatabaseConfig(env)
  };
}

module.exports = { loadConfig };
