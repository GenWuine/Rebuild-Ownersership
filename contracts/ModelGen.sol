// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ModelGen is ERC721URIStorage {

    constructor() ERC721("Genwuine Model", "GM") {}

    uint256 public _modelId = 0;

    event ModelMinted(
        uint256 indexed tokenId
    );

    function mintModel(string memory _uri) public {
        ++_modelId;
        uint256 newTokenId = _modelId;
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _uri);
        emit ModelMinted(_modelId);
    }
}