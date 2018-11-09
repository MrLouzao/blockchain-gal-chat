var BlockchainChat = artifacts.require('./BlockchainGalChat.sol');

module.exports = function (deployer) {
  deployer.deploy(BlockchainChat)
}
