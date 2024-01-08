// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTCollection is Ownable, ERC721, ERC721URIStorage {
    uint256 public nextTokenId;

    constructor() Ownable(msg.sender) ERC721("Tay Ninh Land", "LTN") {
        // _transferOwnership(msg.sender);
    }

    function mint(address _to, string memory _uri) public onlyOwner {
        _safeMint(_to, nextTokenId);
        _setTokenURI(nextTokenId, _uri);

        nextTokenId++;
    }

    function tokenURI(
        uint256 tokenId
    )
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
