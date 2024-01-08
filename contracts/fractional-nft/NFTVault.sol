// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.20;


import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./NFTFractional.sol";
import "./interfaces/INFTVault.sol";
import "./storages/SNFTVault.sol";

contract NFTVault is SNFTVault, NFTFractional {
    constructor(address _collection, uint256 _tokenId) {
        collection = _collection;
        tokenId = _tokenId;

        state = State.inactive;
    }

    function fractionalize(
        address _to,
        uint256 _supply
    ) external override {
        require(state == State.inactive, "State should be inactive");
        _mint(_to, _supply);
        state = State.fractionalized;

        emit Fractionalized(collection, address(this));
    }

    function configureSale(uint256 _price) external override {
        require(state == State.fractionalized, "The state should be fractionalized");
        require(_price > 0, "The listing price should be > 0");
        
        listPrice = _price;
        state = State.live;
    }


    function purchase(uint256 _amount) external override {
        emit Purchased(msg.sender, _amount);
    }

    function redeem() external override {
        address sender = msg.sender;
        uint256 balance = IERC20(address(this)).balanceOf(_msgSender());
        if(balance < totalSupply()) {
            revert NotEnoughBalance(sender, totalSupply());
        }

        state = State.redeemed;

        _burn(sender, totalSupply());
        IERC721(collection).safeTransferFrom(address(this), sender, tokenId);

        emit Redeemd(msg.sender, collection, tokenId);
    }
}