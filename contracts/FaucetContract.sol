// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Owned.sol";
import "./Logger.sol";
import "./IFaucet.sol";

contract Faucet is Owned, Logger, IFaucet {
    // storage variables
    uint256 public funds = 1000;

    // address[] public funders;

    uint256 public numOfFunders;
    mapping(address => bool) private funders;

    // lookup table
    mapping(uint256 => address) private lutFunders;

    modifier limitWithdraw(uint256 withdrawAmount) {
        require(
            withdrawAmount <= 100000000000000000,
            "Cannot withdraw more than 0.1 ether"
        );
        _;
    }

    function emitLog() public pure override returns (bytes32) {
        return "Hello world";
    }

    receive() external payable {}

    function addFunds() external payable override {
        // funders.push(msg.sender);
        address funder = msg.sender;
        if (!funders[funder]) {
            lutFunders[numOfFunders++] = funder;
            funders[funder] = true;
        }
    }

    function withdraw(uint256 withdrawAmount)
        external
        override
        limitWithdraw(withdrawAmount)
    {
        // transfers Ether to msg.sender
        payable(msg.sender).transfer(withdrawAmount);
    }

    function getAllFunders() external view returns (address[] memory) {
        address[] memory _funders = new address[](numOfFunders);
        for (uint256 i = 0; i < numOfFunders; i++) {
            _funders[i] = lutFunders[i];
        }
        return _funders;
    }

    function getFundersAtIndex(uint256 index) external view returns (address) {
        return lutFunders[index];
    }
}

/**
uint256 can keep 256 1s and 0s (min 0, max 2^256 - 1)
int256 can keep 256 1s and 0s (min -2^255, max 2^255 - 1)

e.g. 
max_value in uint32 is 2^32 - 1 = 4294967295

Application Binary Interface (ABI):
- residing address
- functions we can call

For your contract to be able to recieve any Ether transactions
it should have a receive() external payable{} function. This function should have payable modifier.
another function that has payable modifier can make the contract recieve Ether when executed
 */

/**
 const instance = await Faucet.deployed()

 only payable functions have value attribute
 instance.addFunds({from: accounts[0], value: "200000"})
 instance.addFunds({from: accounts[1], value: "2000000000000000000"})

 instance.withdraw("500000000000000000", {from: accounts[1]})
  */

// functions inherited from interfaces must be overriden

/**
function accessibility :- 
private - can only be called inside the contract
internal - can be called within the contract and the inheriting contracts
public - they can be called anywhere
external - can only be called from outside of the contract
 */