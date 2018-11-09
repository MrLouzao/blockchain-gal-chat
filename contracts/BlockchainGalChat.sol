pragma solidity ^0.4.19;

contract BlockchainGalChat {
    
    string[] messages;
    uint256 lastIndex;
    
    event MessageWritten(string msg);
    
    
    constructor() public {
        lastIndex = 0;
        messages.push("Contract created");
        lastIndex++;
    }
    
    
    function getNumberOfMessages() public view returns (uint){
        return messages.length;
    }
    
    
    function getMessage(uint msgIndex) public view returns(string){
        return messages[msgIndex];
    }
    
    
    function storeMsg(string msg) public {
        messages.push(msg);
        lastIndex++;
        emit MessageWritten(msg);
    }
    
    
}