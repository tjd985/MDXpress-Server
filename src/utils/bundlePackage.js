const webpack = require("webpack");
const path = require("path");

async function bundlePackage(entryPointPath) {
  return new Promise((resolve, reject) => {
    webpack(
      {
        mode: "development",
        entry: entryPointPath,
        output: {
          path: path.resolve(__dirname, "../../", "dist"),
          filename: "packageBundle.js",
          libraryTarget: "umd",
        },
      },
      (error, stats) => {
        if (error || stats.hasErrors()) {
          reject(new Error());

          return;
        }

        resolve();
      },
    );
  });
}

module.exports = bundlePackage;
