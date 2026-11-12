#!/usr/bin/env node
/* Bundles the game into one self-contained HTML file (dist/index.html).
 *
 *   node tools/build.mjs            inline every script as-is
 *   node tools/build.mjs --minify   also minify with terser (npm i -D terser)
 *
 * The repo runs without a build: open index.html through any static server (or GitHub Pages).
 * The single-file build is for places that want one file, such as a Claude artifact.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const minify = process.argv.includes("--minify");
let terser = null;
if (minify) {
  try {
    terser = await import("terser");
  } catch {
    console.error("terser is not installed: run `npm i -D terser`, or build without --minify");
    process.exit(1);
  }
}

let html = await readFile(resolve(root, "index.html"), "utf8");
const tags = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)];
let total = 0;
for (const [tag, src] of tags) {
  let code = await readFile(resolve(root, src), "utf8");
  if (terser && !/vendor\//.test(src)) {
    const out = await terser.minify(code, { compress: { passes: 2 }, mangle: true, format: { comments: /^!|@license|\(c\)/i } });
    if (out.error) throw out.error;
    code = out.code;
  }
  total += code.length;
  // a literal </script> inside a string would end the inline block early
  code = code.replace(/<\/script/gi, "<\\/script");
  html = html.replace(tag, () => `<script>/* ${src} */\n${code}\n</script>`);
}
// the manifest is a separate file; a single-file build cannot reference it
html = html.replace(/<link rel="manifest"[^>]*>\n?/, "");
await mkdir(resolve(root, "dist"), { recursive: true });
await writeFile(resolve(root, "dist/index.html"), html);
console.log(`dist/index.html  ${(html.length / 1024).toFixed(0)} KB  (${tags.length} scripts, ${(total / 1024).toFixed(0)} KB of JS${minify ? ", minified" : ""})`);
