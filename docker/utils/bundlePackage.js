const util = require("util");
const webpack = util.promisify(require("webpack").webpack);
const path = require("path");

async function bundlePackage(packageName, entryPointPath) {
  await webpack({
    mode: "development",
    entry: entryPointPath,
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: `${packageName}.js`,
      libraryTarget: "umd",
    },
  });
}

module.exports = bundlePackage;
