const path = require("path");
const fs = require("node:fs");
const { argv } = require("node:process");
const util = require("util");
const exec = util.promisify(require("node:child_process").exec);

const bundlePackage = require("./bundlePackage");
const getEntryPointPath = require("./getEntryPointPath");

async function getBundleCode(packageName) {
  packageName = argv[2];

  await exec(`npm install ${packageName}`);
  const entryPointPath = getEntryPointPath(packageName);
  await bundlePackage(packageName, entryPointPath);
  const bundleCodePath = path.resolve(__dirname, "dist", `${packageName}.js`);
  const bundledPackageCode = fs.readFileSync(bundleCodePath, {
    encoding: "utf8",
  });

  console.log(bundledPackageCode);

  return bundledPackageCode;
}

getBundleCode(argv);
