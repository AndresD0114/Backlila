const { spawn, spawnSync } = require("node:child_process");
const path = require("node:path");
const watch = process.argv.includes("--watch");
const packages = ["@lila/cases-api", "@lila/gateway-controller"];
const children = packages.map(packageName => {
  const entry = path.join(path.dirname(require.resolve(packageName)), "server.js");
  return spawn(process.execPath, [...(watch ? ["--watch"] : []), entry], { stdio: "inherit", env: process.env });
});
let stopping = false;

function terminateChild(child) {
  if (!child.pid || child.exitCode !== null || child.signalCode !== null) return;

  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true
    });
    return;
  }

  child.kill("SIGTERM");
}

function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;
  for (const child of children) terminateChild(child);
}
for (const child of children) {
  child.on("error", error => { console.error(error.message); stop(1); });
  child.on("exit", code => { if (!stopping) stop(code || 1); });
}
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
