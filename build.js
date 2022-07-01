const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

if (fs.existsSync(path.join(__dirname, "dist")))
  fs.rmSync(path.join(__dirname, "dist"), { recursive: true, force: true });
else fs.mkdirSync(path.join(__dirname, "dist"));

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
