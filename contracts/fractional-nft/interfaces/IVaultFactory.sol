pragma solidity 0.8.20;

interface IVaultFactory {
    function getVault(
        address _collection,
        uint256 _tokenId,
        uint256 _supply,
        uint256 _price
    ) external returns (address);

    function createVault(
        address _collection,
        uint256 _tokenId,
        uint256 _supply,
        uint256 _price
    ) external returns (address);

    /// @notice Emitted when a new NFT vault is deployed.
    event VaultCreated(
        address collection,
        uint tokenId,
        address vault,
        uint vaultCount
    );
}
