const assert = require("node:assert/strict");
const test = require("node:test");

const { createApp } = require("../APIs/Cases/api/src/app");
const { createContainer } = require("@lila/cases-infrastructure");
const { CasoService } = require("@lila/cases-business");
const { validarId } = require("@lila/cases-helpers");

const ID_CASO = "550e8400-e29b-41d4-a716-446655440000";

test("el helper UUID valida IDs y conserva el nombre del campo", () => {
  assert.doesNotThrow(() => validarId(ID_CASO, "idCaso"));
  assert.throws(
    () => validarId("invalido", "idCaso"),
    error => error.code === "VALIDATION_ERROR" && error.message === "idCaso debe ser un UUID"
  );
});

test("el contenedor conecta cada business con su repositorio", async () => {
  const container = createContainer({
    database: {
      database: "lila_test",
      user: "test",
      password: "test",
      host: "127.0.0.1",
      port: 3306
    }
  });

  try {
    assert.equal(container.services.Caso.casoRepository, container.repositories.Caso);
    assert.equal(container.services.Responsable.responsableRepository, container.repositories.Responsable);
    assert.equal(container.services.TipoAcoso.tipoAcosoRepository, container.repositories.TipoAcoso);
    assert.equal(container.services.Usuario.usuarioRepository, container.repositories.Usuario);
  } finally {
    await container.close();
  }
});

test("HTTP comunica rutas, controlador, business y repositorio de Caso", async () => {
  let casoCreado;

  const casoRepository = {
    async obtenerPorCodigo() { return null; },
    async crear(registro) {
      casoCreado = registro;
      return {
        idUsuario: registro.usuario.idUsuario,
        InfoAfectadoID: 1,
        UsuarioCreado: true
      };
    },
    async obtenerPorId(idCaso) { return { idCaso }; },
    async obtenerTodos() { return []; },
    async actualizar(idCaso, datos) { return { idCaso, ...datos }; },
    async eliminar() { return true; }
  };

  const app = createApp({
    services: {
      Caso: new CasoService(casoRepository),
      Responsable: {},
      TipoAcoso: {},
      Usuario: {}
    }
  });

  const server = app.listen(0, "127.0.0.1");

  try {
    await new Promise((resolve, reject) => {
      server.once("listening", resolve);
      server.once("error", reject);
    });

    const baseUrl = `http://127.0.0.1:${server.address().port}/api`;
    const crearResponse = await fetch(`${baseUrl}/casos`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        idUsuario: ID_CASO,
        usuario: { deviceId: "dispositivo-prueba" },
        idTipoAcoso: 1,
        descripcion: "Caso de prueba",
        infoAfectado: { tipoUsuario: "estudiante" }
      })
    });
    const crearBody = await crearResponse.json();

    assert.equal(crearResponse.status, 201);
    assert.ok(casoCreado);
    assert.equal(casoCreado.caso.idCaso, casoCreado.infoAfectado.idCaso);
    assert.match(casoCreado.caso.codigoCaso, /^[a-f0-9]{64}$/);
    assert.match(crearBody.data.codigoCaso, /^#[A-Z]{2}-[A-Z0-9]{5}$/);

    const evidenciaResponse = await fetch(`${baseUrl}/evidencias`);
    const evidenciaBody = await evidenciaResponse.json();

    assert.equal(evidenciaResponse.status, 404);
    assert.equal(evidenciaBody.error.code, "NOT_FOUND");

    const idInvalidoResponse = await fetch(`${baseUrl}/casos/id-invalido`);
    const idInvalidoBody = await idInvalidoResponse.json();

    assert.equal(idInvalidoResponse.status, 400);
    assert.equal(idInvalidoBody.error.code, "VALIDATION_ERROR");
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
