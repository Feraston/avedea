import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "out");
const basePath = (process.env.NEXT_BASE_PATH || "").replace(/\/$/, "");

// GitHub Pages: skip Jekyll processing
fs.writeFileSync(path.join(outDir, ".nojekyll"), "");

/**
 * Static HTML redirects from legacy .html paths to new App Router paths.
 */
const redirects = [
  ["page/services.html", `${basePath}/services/`],
  ["page/catalog.html", `${basePath}/`],
  ["page/training.html", `${basePath}/training/`],
  ["page/abon/abon1.html", `${basePath}/abon/abon1/`],
  ["page/abon/abon2.html", `${basePath}/abon/abon2/`],
  ["page/abon/abon3.html", `${basePath}/abon/abon3/`],
  ["page/spec/pers_es.html", `${basePath}/specialists/elena-sorokina/`],
  ["page/spec/pers_vp.html", `${basePath}/specialists/viktoria-priemskaya/`],
  ["page/spec/pers_ak.html", `${basePath}/`],
];

try {
  const services = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "data", "services.json"), "utf8")
  );
  for (const s of services) {
    redirects.push([
      `page/uslugi/${s.category}/${s.slug}.html`,
      `${basePath}/services/${s.category}/${s.slug}/`,
    ]);
  }
} catch {
  console.warn("services.json missing; skipping service redirects");
}

function writeRedirect(fromRel, toPath) {
  const dest = path.join(outDir, fromRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0; url=${toPath}" />
  <link rel="canonical" href="https://avedea.ru${toPath}" />
  <title>Redirecting…</title>
  <script>location.replace(${JSON.stringify(toPath)});</script>
</head>
<body>
  <p>Перенаправление: <a href="${toPath}">${toPath}</a></p>
</body>
</html>
`;
  fs.writeFileSync(dest, html, "utf8");
}

for (const [from, to] of redirects) {
  writeRedirect(from, to);
}

console.log(`Wrote ${redirects.length} redirects + .nojekyll`);
