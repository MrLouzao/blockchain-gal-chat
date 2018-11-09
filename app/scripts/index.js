// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'
import $ from "jquery";

// Import our contract artifacts and turn them into usable abstractions.
import blockchainGalChatArtifact from '../../build/contracts/blockchainGalChat.json';

// MetaCoin is our usable abstraction, which we'll use through the code below.
const BlockchainChat = contract(blockchainGalChatArtifact)

const ROPSTEN_CHAT_ADDRESS = "0xc63eece1820efb74cf86a50a197ffb68955b8d6a";

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts;
let account;
var chatInstance;
var msgWrittenEvent;

const App = {
  start: function () {
    const self = this

    // Bootstrap the MetaCoin abstraction for Use.
    BlockchainChat.setProvider(web3.currentProvider)

    $('#chat').hide();


    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accounts[0]
      console.log("Current account: " + account);
      document.getElementById("my-address").innerText = account;
    })

  },


  createContract: function() {
    console.log("Creating contract...");

    $('#actions').hide();
    $('#chat').show();

    // Create a new instance of the game and return the object
    BlockchainChat.new({
      from: account,
      gas: 3000000
    })
    .then(instance => {
      chatInstance = instance;
      App.addMessage("Contract created");
      App.addMessage("Contract address: " + instance.address);
      App.listenToEvents();
    });
  },


  joinContract: function() {
    $('#actions').hide();
    $('#chat').show();

    var chatAddr = prompt("Address of the chat");

    BlockchainChat.at(chatAddr)
      .then(function(instance){
        chatInstance = instance;
        App.addMessage("Contract joined at: " + chatAddr);
        App.listenToEvents();
        App.readOldMessages()
    });
  },


  readOldMessages: function() {
    chatInstance.getNumberOfMessages.call()
      .then(nMsg => {
        for(var i=0; i<nMsg; i++) {
          chatInstance.getMessage.call(i)
          .then(msgToPrint => App.addMessage(msgToPrint))
        }
        console.log("Mensajes antiguos: " + nMsg);
      });
  },


  sendMessage: function() {
    var textToWrite = document.getElementById("msgToWrite").value;
    if(textToWrite){
      chatInstance.storeMsg(textToWrite, {
        from: account
      })
      .then(txResult => {
        console.log("Mensaxe gardada");
        console.log(txResult);
      });
      document.getElementById("msgToWrite").value = "";
    }
  },


  listenToEvents: function(){
    msgWrittenEvent = chatInstance.MessageWritten();
    msgWrittenEvent.watch(App.onNewMessage);
  },

  onNewMessage: function(err, eventObj) {
    console.log(eventObj);
    if(err){
      alert("Produciuse un erro nun evento");
    } else {
      App.addMessage(eventObj.args.msg);
    }
  },


  addMessage: function(msg) {
    var msgContent = document.createElement("p");
    msgContent.innerText = msg;
    $('#messages').append(msgContent);
  },

}


/** Generated code to integrate with blockchain and web3 */
window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
  }

  App.start()
})
