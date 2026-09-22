const CASES_PATHS = Object.freeze([
  "/api/casos",
  "/api/evidencias",
  "/api/responsables",
  "/api/tipos-acoso"
]);

function serviceUrl(value) {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("Los destinos deben ser URLs HTTP(S) de origen");
  }
  return url.origin;
}

function createRouteTable({ casesUrl, usersUrl }) {
  const cases = serviceUrl(casesUrl);
  return [
    ...CASES_PATHS.map(prefix => ({ prefix, target: cases })),
    { prefix: "/api/usuarios", target: usersUrl ? serviceUrl(usersUrl) : cases }
  ];
}

function resolveRoute(routes, pathname) {
  return routes.find(({ prefix }) => pathname === prefix || pathname.startsWith(prefix + "/"));
}

function loadConfig(env = process.env) {
  const port = Number(env.GATEWAY_PORT || 3000);
  const timeoutMs = Number(env.PROXY_TIMEOUT_MS || 10000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("GATEWAY_PORT inválido");
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1) throw new Error("PROXY_TIMEOUT_MS inválido");
  return {
    port,
    host: env.GATEWAY_HOST || "127.0.0.1",
    timeoutMs,
    casesUrl: env.CASES_SERVICE_URL || "http://127.0.0.1:3001",
    usersUrl: env.USERS_SERVICE_URL || undefined,
    corsOrigins: (env.CORS_ORIGINS || "").split(",").map(value => value.trim()).filter(Boolean)
  };
}

module.exports = { CASES_PATHS, serviceUrl, createRouteTable, resolveRoute, loadConfig };

