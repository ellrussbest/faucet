# npm packages
- web3 - web3js api
- @metamask/detect-provider -> utility to help detect the provider
- @truffle/contract -> creates contract abstraction

# commands
- truffle init -> used to initialize the truffle and create truffle-config.js file
- truffle migrate -> used to migrate the contract
- truffle migrate --reset -> used when you want to remigrate your contract
- truffle compile -> used to compile the project
- truffle console -> to open the truffle console
    - on the truffle console you can write normal javascript code e.g. `const instance = await ContractName.deployed()`
    - `accounts` -> gives you a list of accounts
    - all public variables will have a getter function by default e.g. `const publicVariable = await instance.publicVariable()` or `const methodName = await instance.methodName()`
    - to convert BN type to string you use the toString() method
    - accessing the contract using web3js api in truffle is as follows: `const instance = new web3.eth.Contract(contractName.abi, "addressOfContract")`
    - accessing a particular method using web3js: `let methodName = await instance.methods.methodName().call()`
    - making transactions using web3: `web3.eth.sendTransaction({from: account, to: account, value: value})`
    - `web3.eth.getBlock("blockNumber")`
    - `web3.eth.getCode("contractAddress")` -> getting the byte code.
    - `web3.eth.sendTransaction({from: "accountAddress", to: "accountAddress", value: "value in wei", data: "function signature" })` -> you can execute a function through sending its signature in a transaction. This funcition will only work if it is payable
    - To access the slots in your contract storage: `web3.eth.getStorageAt("contractAddress", slotIndex)`

# general knowledge
- tx fees = gas price * gas limit
- keccak gives an output of 32bytes in base16(hexadecimal) format
- getting the function signature:-
    - let us say we have a function called setCompleted(uint256 completed) we will hash using keccak setCompleted(uint256)
    - the first 4 bytes on the hashing result will represent the function signature e.g. in our case, fdacd576
    - the rest 32 bytes represent the input parameters of the function in base15 (hexadecimal)
- To know more about the blocks you can visit eth hash
- rlp (recursive length prefix) - the serialization used in ethereum
- you can use JSON RPC calls to interact with your smart contract
- codes wrapped in assembly block code are low level codes e.g.
```
function test(uint testNum) external pure returns (uint data) {
    assembly {
        // instantiating a variable
        // instantiated memory will first be stored on the stack
        let _num := 4

        // loading free memory pointer from address 0x40
        let _fmp := mload(0x40)


        // on the free memory pointer, store address 0x90
        mstore(0x40, 0x90)
    }

    uint8[3] memory items = [1, 2, 3];
    // the value 1 in the array will be stored 32 bytes offset of the 0x90 memory address

    // returning using assembly
    assembly {
        // on the variable data,
        // load the sum of address 90 and the value 
        // of 32 bytes offset i.e. it will return 
        // sum of 1 and 2 which is 3
        data := mload(add(0x90, 0x20))
    }
}

function test2() external pure returns (uint data) {
    assembly {
        // variable fmp will store address 0x40
        let fmp := mload(0x40)
        // we want to store string hello
        // convert hello text to binary
        // convert the binary to hex
        // hello in hex is 0x68656C6C6F

        // at the address stored in fmp store 
        // hello-hex
        // add(fmp, 0x00) says offset the address of fmp 
        // to 0x00 hex
        mstore(add(fmp, 0x00), 0x68656C6C6F)
        
        // return Hello in terms of int to data variable param
        data := mload(add(fmp, 0x00))
    }
}
```

## bytecode instructions
1. on the blockchain we only deploy the execution part of the code and not the initialization part of the code
2. the initialization instructions of our contract are as follows (instructions on the bytecode are stored on the stack, temporary data are stored in memory, and storage store persistent data) instruction are executed byte by byte: 0x 60 80 60 40 52 61 03 e8 60 00 55 34 80 15 61 00 16 57 60 00 80 fd 5b 50 60 bc 80 61 00 25 60 00 39 60 00 f3 fe
3. get the meaning of each byte of intstruction from the ethereum yellow pages.
- 0x60 -> push instruction i.e. push (0x80 -> word)
- 0x60 -> push (0x40 -> free memory pointer)
- 0x52 -> MSTORE (save word to memory) memory[0x40] = 0x80 then pop stack when pushed to 0x40, 0x80 can is now considered a free memory and can be written on
- 61 -> place two items on stack push(0x03) and push (0xe8)
- push (0x00)
- 55 -> save word to storage memory[0xe8] = 0x03 
34801561001657600080fd5b5060bc806100256000396000f3fe
3. etc. program counter is keeping check of the instruction that we are currently on