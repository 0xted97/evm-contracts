// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {BaseHandles} from "./BaseHandles.sol";

contract TaoWHandles is BaseHandles {
    constructor(address owner) BaseHandles(owner) {}

    function name() public pure virtual override returns (string memory) {
        return 'TaoW Username';
    }

    function symbol() public pure virtual override returns (string memory) {
        return 'TaoW';
    }

    function getNamespace() public pure virtual override returns (string memory) {
        return 'taow';
    }
}