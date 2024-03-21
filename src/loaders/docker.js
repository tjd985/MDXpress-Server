const util = require("util");
const exec = util.promisify(require("node:child_process").exec);

async function getDockerImage() {
  await exec("docker pull tjd985/mdxpress-docker:1.0");
}

module.exports = getDockerImage;
