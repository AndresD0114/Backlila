function envelope({ success = true, message = "Operación realizada correctamente", data = null, meta = null, error = null, traceId = null } = {}) {
  return { success, message, data, meta, error, traceId, timestamp: new Date().toISOString() };
}
function send(res, status, data, message, meta = null) {
  return res.status(status).json(envelope({ data, message, meta, traceId: res.locals.traceId }));
}
const ApiResponse = {
  ok: (res, data, message, meta) => send(res, 200, data, message, meta),
  created: (res, data, message) => send(res, 201, data, message),
  failure: (res, status, message, code, details = null) =>
    res.status(status).json(envelope({ success: false, message, error: { code, details }, traceId: res.locals.traceId }))
};
module.exports = { ApiResponse, envelope };

