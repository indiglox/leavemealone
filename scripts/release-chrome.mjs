import { cp, mkdir, mkdtemp, readFile, readdir, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distChromeDir = path.join(rootDir, "dist", "chrome");
const artifactsDir = path.join(rootDir, "artifacts");

async function runNodeScript(...args) {
  await execFileAsync(process.execPath, args, { cwd: rootDir });
}

async function copyDirectory(source, destination) {
  await mkdir(destination, { recursive: true });
  for (const entry of await readdir(source)) {
    const sourcePath = path.join(source, entry);
    const destinationPath = path.join(destination, entry);
    const entryStat = await stat(sourcePath);

    if (entryStat.isDirectory()) {
      await copyDirectory(sourcePath, destinationPath);
      continue;
    }

    if (entry.endsWith(".map")) {
      continue;
    }

    await cp(sourcePath, destinationPath);
  }
}

async function main() {
  const packageJson = JSON.parse(await readFile(path.join(rootDir, "package.json"), "utf8"));
  const version = packageJson.version;
  const artifactBaseName = `leave-me-alone-${version}-chrome`;
  const artifactPath = path.join(artifactsDir, `${artifactBaseName}.zip`);
  const stageRoot = await mkdtemp(path.join(tmpdir(), "leave-me-alone-"));
  const stageDir = path.join(stageRoot, artifactBaseName);

  try {
    await runNodeScript("esbuild.config.mjs", "chrome", "--release");
    await mkdir(artifactsDir, { recursive: true });
    await copyDirectory(distChromeDir, stageDir);
    await rm(artifactPath, { force: true });
    await execFileAsync("zip", ["-qr", artifactPath, "."], { cwd: stageDir });
    console.log(`Created ${artifactPath}`);
  } finally {
    await rm(stageRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
