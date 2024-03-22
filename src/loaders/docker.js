const util = require("util");
const exec = util.promisify(require("node:child_process").exec);

async function getDockerImage() {
  try {
    await exec("docker pull tjd985/mdxpress-docker:1.0");

    console.log("Docker image loaded successfully");
  } catch (err) {
    console.log(err);
  }
}

module.exports = getDockerImage;
