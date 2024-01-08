// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./NFTVault.sol";

import "./storages/SVaultFactory.sol";
import "./interfaces/IVaultFactory.sol";

contract VaultFactory is SVaultFactory, IVaultFactory {
    constructor() Ownable(msg.sender) {
       
    }

    function createVault(address _collection, uint256 _tokenId, uint256 _supply, uint256 _price) external override returns(address) {
        bytes32 salt = keccak256(
            abi.encodePacked(_collection, _tokenId, _supply, _price, address(this))
        );

        NFTVault vault = new NFTVault{salt: salt}(_collection, _tokenId);
        address vaultAddress = address(vault);

        vault.fractionalize(msg.sender, _supply);
        vault.configureSale(_supply);


        vaultCount++;
        vaults[vaultCount] = vaultAddress;

        // Transfer NFT
        IERC721(_collection).transferFrom(msg.sender, address(vault), _tokenId);

        emit VaultCreated(_collection, _tokenId, vaultAddress, vaultCount);

        return vaultAddress;
    }

    function getVault(address _collection, uint256 _tokenId, uint256 _supply, uint256 _price) public view override returns(address) {
        bytes32 salt = keccak256(
            abi.encodePacked(_collection, _tokenId, _supply, _price, address(this))
        );
        
        bytes memory bytecode = abi.encodePacked(type(NFTVault).creationCode,  abi.encode(_collection, _tokenId));

        bytes32 hash = keccak256(
            abi.encodePacked(bytes1(0xff), address(this), salt, keccak256(bytecode))
        );

        return address(uint160(uint(hash)));
    }
    
}