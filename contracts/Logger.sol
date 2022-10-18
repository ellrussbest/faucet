// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// provides function definition but does not necessarily provide
// actual implementation of the function

abstract contract Logger {
    uint256 public testNum;

    constructor() {
        testNum = 1000;
    }

    // definition of a function
    function emitLog() public virtual returns (bytes32);

    // implementation of a function
    function test() external pure returns (uint256) {
        return 100;
    }
}
