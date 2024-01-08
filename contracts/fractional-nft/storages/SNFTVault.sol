// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.20;

import "./../interfaces/INFTVault.sol";

abstract contract SNFTVault is INFTVault {
    // Information of Collection
    address public collection;
    uint256 public tokenId;
    string public uri;

    State public state;

    /// @notice The price of fraction of the fractionalized NFT for the primary sale.
    uint256 public listPrice;

    /// @notice The address who initially deposited the NFT.
    address public curator;
}