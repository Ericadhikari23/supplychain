const SimpleStorage = artifacts.require('./indentify');

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
};
