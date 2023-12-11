// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ContentGen is ERC721URIStorage {
    
    address tba;
    
    constructor(address _tba) ERC721("Content NFT", "CoNFT") {
        tba = _tba;
    }

    uint256 public _contentId = 0;

    event ContentMinted(
        uint256 indexed tokenId,
        address tba
    );

    function mintContent(address _tba, string memory _uri) public returns (uint256) {
        ++_contentId;
        uint256 newTokenId = _contentId;
        _mint(_tba, newTokenId);
        _setTokenURI(newTokenId, _uri);
        emit ContentMinted(_contentId, tba);
        return _contentId;
    }
}