// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";


contract NFTFractional is ERC20 {
    constructor() ERC20("NFT Fractional","FNFT") {

    }
}