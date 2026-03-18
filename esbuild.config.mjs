import { build } from "esbuild";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const browser = process.argv[2] === "firefox" ? "firefox" : "chrome";
const isRelease = process.argv.includes("--release");
const outdir = path.join(__dirname, "dist", browser);

async function bundle() {
  await rm(outdir, { recursive: true, force: true });
  await mkdir(outdir, { recursive: true });

  await build({
    entryPoints: {
      content: path.join(__dirname, "src/content/index.ts"),
      popup: path.join(__dirname, "src/popup/index.ts")
    },
    bundle: true,
    format: "iife",
    target: "es2022",
    outdir,
    sourcemap: isRelease ? false : true,
    legalComments: "none",
    loader: {
      ".css": "copy",
      ".html": "copy"
    },
    define: {
      __BROWSER_TARGET__: JSON.stringify(browser)
    }
  });

  const manifest = JSON.parse(
    await readFile(path.join(__dirname, "manifests", `${browser}.json`), "utf8")
  );

  await writeFile(
    path.join(outdir, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );

  await cp(path.join(__dirname, "src", "popup", "popup.html"), path.join(outdir, "popup.html"));
  await cp(path.join(__dirname, "src", "popup", "styles.css"), path.join(outdir, "styles.css"));
  await cp(path.join(__dirname, "assets", "icons"), path.join(outdir, "icons"), { recursive: true });
}

bundle().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
