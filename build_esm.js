import { existsSync, rmSync, mkdirSync } from "fs";
import path, { join } from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

if (existsSync(join(__dirname, "dist")))
  rmSync(join(__dirname, "dist"), { recursive: true, force: true });
else mkdirSync(join(__dirname, "dist"));

exec(
  "tsc -b tsconfig.build.json tsconfig.esm.json tsconfig.types.json",
  (err, stdout, stderr) => {
    if (err) {
      console.log(`error: ${err.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
  }
);
