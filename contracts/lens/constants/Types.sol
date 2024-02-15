// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0;

/**
 * @title Types
 * @author TaoW Protocol
 *
 * @notice A standard library of data types used throughout the TaoW Protocol.
 */
library Types {
    /**
     * @notice ERC721Timestamped storage. Contains the owner address and the mint timestamp for every NFT.
     *
     * Note: Instead of the owner address in the _tokenOwners private mapping, we now store it in the
     * _tokenData mapping, alongside the mint timestamp.
     *
     * @param owner The token owner.
     * @param mintTimestamp The mint timestamp.
     */
    struct TokenData {
        address owner;
        uint96 mintTimestamp;
    }


    /**
     * @notice A struct containing the necessary information to reconstruct an EIP-712 typed data signature.
     *
     * @param signer The address of the signer. Specially needed as a parameter to support EIP-1271.
     * @param v The signature's recovery parameter.
     * @param r The signature's r parameter.
     * @param s The signature's s parameter.
     * @param deadline The signature's deadline.
     */
    struct EIP712Signature {
        address signer;
        uint8 v;
        bytes32 r;
        bytes32 s;
        uint256 deadline;
    }

    /**
     * @notice A struct containing profile data.
     *
     * @param pubCount The number of publications made to this profile.
     * @param followModule The address of the current follow module in use by this profile, can be address(0) in none.
     * @param followNFT The address of the followNFT associated with this profile. It can be address(0) if the
     * profile has not been followed yet, as the collection is lazy-deployed upon the first follow.
     * @param __DEPRECATED__handle DEPRECATED in V2: handle slot, was replaced with LensHandles.
     * @param __DEPRECATED__imageURI DEPRECATED in V2: The URI to be used for the profile image.
     * @param __DEPRECATED__followNFTURI DEPRECATED in V2: The URI used for the follow NFT image.
     * @param metadataURI MetadataURI is used to store the profile's metadata, for example: displayed name, description,
     * interests, etc.
     */
    struct Profile {
        uint256 pubCount; // offset 0
        address followModule; // offset 1
        address followNFT; // offset 2
        string __DEPRECATED__handle; // offset 3
        string __DEPRECATED__imageURI; // offset 4
        string __DEPRECATED__followNFTURI; // Deprecated in V2 as we have a common tokenURI for all Follows, offset 5
        string metadataURI; // offset 6
    }

    /**
     * @notice A struct containing the parameters required for the `createProfile()` function.
     *
     * @param to The address receiving the profile.
     * @param followModule The follow module to use, can be the zero address.
     * @param followModuleInitData The follow module initialization data, if any.
     */
    struct CreateProfileParams {
        address to;
        address followModule;
        bytes followModuleInitData;
    }

}
