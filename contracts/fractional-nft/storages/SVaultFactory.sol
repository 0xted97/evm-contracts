// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract SVaultFactory is Ownable {
    uint256 public vaultCount;
    mapping(uint => address) public vaults;

    // Gap storage slot
}
