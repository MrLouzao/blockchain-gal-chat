var BlockchainChat = artifacts.require('./BlockchainChat.sol');

module.exports = function (deployer) {
  deployer.deploy(BlockchainChat)
}
