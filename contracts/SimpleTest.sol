// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract SimpleTest {
    string public message;
    address public owner;
    
    constructor() {
        message = "Hello VeChain!";
        owner = msg.sender;
    }
    
    function setMessage(string memory _message) public {
        require(msg.sender == owner, "Only owner can set message");
        message = _message;
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
}
