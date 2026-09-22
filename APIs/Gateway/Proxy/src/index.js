const http = require("node:http");
const https = require("node:https");
const { AppError, ServiceUnavailableError } = require("@lila/errors");

const hopHeaders = ["connection", "keep-alive", "proxy-authenticate", "proxy-authorization", "te", "trailer", "transfer-encoding", "upgrade"];

function cleanHeaders(headers) {
  const result = { ...headers };
  const connection = String(headers.connection || "").split(",").map(value => value.trim().toLowerCase());
  for (const key of [...hopHeaders, ...connection]) delete result[key];
  return result;
}

function createProxy(target, { timeoutMs = 10000 } = {}) {
  const origin = new URL(target);
  return function proxy(req, res, next) {
    const transport = origin.protocol === "https:" ? https : http;
    let settled = false;
    const headers = cleanHeaders(req.headers);
    headers.host = origin.host;
    headers["x-request-id"] = res.locals.traceId;
    headers["x-forwarded-for"] = req.socket.remoteAddress || "";
    headers["x-forwarded-proto"] = req.protocol;
    headers["x-forwarded-host"] = req.get("host") || "";

    const upstream = transport.request({
      protocol: origin.protocol,
      hostname: origin.hostname,
      port: origin.port,
      method: req.method,
      path: req.originalUrl,
      headers
    });

    const fail = error => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      req.unpipe(upstream);
      upstream.destroy();
      if (res.headersSent) res.destroy();
      else next(error);
    };

    const timer = setTimeout(
      () => fail(new AppError("Tiempo de espera agotado", 504, "GATEWAY_TIMEOUT")),
      timeoutMs
    );

    upstream.on("response", response => {
      res.statusCode = response.statusCode;
      const responseHeaders = cleanHeaders(response.headers);
      for (const [key, value] of Object.entries(responseHeaders)) {
        if (key === "x-request-id" || key.startsWith("access-control-")) continue;
        res.setHeader(key, value);
      }
      response.on("error", () => fail(new ServiceUnavailableError()));
      response.on("aborted", () => fail(new ServiceUnavailableError()));
      response.on("end", () => {
        settled = true;
        clearTimeout(timer);
      });
      response.pipe(res);
    });

    upstream.on("error", () => fail(new ServiceUnavailableError()));
    req.on("aborted", () => {
      settled = true;
      clearTimeout(timer);
      upstream.destroy();
    });
    res.on("close", () => {
      clearTimeout(timer);
      if (!res.writableEnded) {
        settled = true;
        upstream.destroy();
      }
    });
    req.pipe(upstream);
  };
}

module.exports = { createProxy };

