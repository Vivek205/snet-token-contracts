let SingularityNetToken = artifacts.require("./SingularityNetToken.sol");

const name = "Sri Token"; // "SingularityNET Token"
const symbol = "SRI"; // "AGI"

module.exports = function (deployer) {
    deployer.deploy(SingularityNetToken, name, symbol);
  };
