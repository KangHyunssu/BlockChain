// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.19;

contract Mint {
    mapping(address => uint256) public contractBalance;
    uint256 totalToken;

    event MyMint(address to, uint256 amount);
    event Rxed(address sender, uint256 amount, string message);

    function mint(uint256 amount) public payable {
        contractBalance[msg.sender] += msg.value;
        totalToken += amount;
        emit MyMint(msg.sender, amount);
        emit Rxed(msg.sender, msg.value, "Event = dkkim ...");
    }

    function totalSupply() public view returns (uint256) {
        return totalToken;
    }

    function getCABalance(address user) public view returns (uint256) {
        return contractBalance[user];
    }
}
