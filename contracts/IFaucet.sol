// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// all interaces must only have EXTERNAL functions
// Interfaces cannot inherit fro other smart contracts
// but they can inherit from other interfaces
// they cannot declare a constructor
// they cannot declare state variables

interface IFaucet {
    function addFunds() external payable;
    function withdraw(uint withdrawAmount) external;
}