// Allows us to use ES6 in our migrations and tests.
require('babel-register')
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "poem help rate boat upset candy squirrel pause van produce merit bone neither mouse hockey";
var privateKey = [
  "25ce5adba550c10888232d686544dad9a4dfac0607afa2e8a6930f7fac012deb"
];


module.exports = {
  networks: {
    ganache: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*' // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/6f55bd56d01d4c4e92ea847a5fbd5d3a")
      },
      network_id: 3
    }
  }  
}
