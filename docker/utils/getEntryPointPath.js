const path = require("path");
const fs = require("node:fs");

function getEntryPointPath(packageName) {
  const packageJsonPath = path.resolve(
    __dirname,
    "node_modules",
    packageName,
    "package.json",
  );

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  const entryPointPath = path.resolve(
    __dirname,
    "node_modules",
    packageName,
    packageJson.main || "index.js",
  );

  console.log(`${packageJson.name} ${packageJson.version}`);

  return entryPointPath;
}

module.exports = getEntryPointPath;
