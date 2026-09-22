const fs = require("node:fs");
const path = require("node:path");
const { createRequire } = require("node:module");
const root = path.resolve(__dirname, "..");
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const name = path.join(dir, entry.name);
    return entry.isDirectory() ? (entry.name === "node_modules" ? [] : walk(name)) : [name];
  });
}
const manifests = ["APIs", "shared"].flatMap(dir => walk(path.join(root, dir))).filter(file => path.basename(file) === "package.json");
const packages = new Map(manifests.map(file => [JSON.parse(fs.readFileSync(file)).name, file]));
for (const [name, file] of packages) {
  const manifest = JSON.parse(fs.readFileSync(file));
  const requireHere = createRequire(file);
  requireHere(name);
  if (!manifest.exports || !manifest.files) throw new Error(name + ": falta API pública o files");
  for (const [dependency, version] of Object.entries(manifest.dependencies || {})) {
    if (version.startsWith("file:")) throw new Error(name + ": dependencia por ruta");
    requireHere.resolve(dependency);
    if (name.startsWith("@lila/gateway-") && dependency.startsWith("@lila/cases-")) throw new Error("Gateway acoplado a Casos");
  }
  for (const source of walk(path.join(path.dirname(file), "src")).filter(file => file.endsWith(".js"))) {
    const text = fs.readFileSync(source, "utf8");
    for (const match of text.matchAll(/require\(["']([^"']+)["']\)/g)) {
      const target = match[1];
      if (target.startsWith(".")) {
        const resolved = path.resolve(path.dirname(source), target);
        const relative = path.relative(path.dirname(file), resolved);
        if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(source + ": import fuera del paquete");
      } else if (!target.startsWith("node:") && !require("node:module").isBuiltin(target)) {
        const dependency = target.startsWith("@") ? target.split("/").slice(0, 2).join("/") : target.split("/")[0];
        if (!manifest.dependencies?.[dependency]) throw new Error(name + ": dependencia no declarada " + dependency);
      }
    }
  }
}
console.log(packages.size + " paquetes verificados: imports, dependencias y límites.");

