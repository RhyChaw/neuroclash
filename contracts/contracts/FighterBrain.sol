// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract FighterBrain is ERC721, Ownable {
	uint256 public nextTokenId;

	// simple on-chain pointer to compressed weights blob (e.g., IPFS hash or base64)
	mapping(uint256 => string) private _weightsURI;

	event BrainMinted(uint256 indexed tokenId, address indexed to, string weightsURI);
	event BrainUpdated(uint256 indexed tokenId, string weightsURI);

	constructor() ERC721("EvoArena Fighter", "BRAIN") Ownable(msg.sender) {}

	function mint(address to, string memory weightsURI) external onlyOwner returns (uint256 tokenId) {
		tokenId = ++nextTokenId;
		_safeMint(to, tokenId);
		_weightsURI[tokenId] = weightsURI;
		emit BrainMinted(tokenId, to, weightsURI);
	}

	function mintSelf(string memory weightsURI) external returns (uint256 tokenId) {
		tokenId = ++nextTokenId;
		_safeMint(msg.sender, tokenId);
		_weightsURI[tokenId] = weightsURI;
		emit BrainMinted(tokenId, msg.sender, weightsURI);
	}

	function setWeightsURI(uint256 tokenId, string memory weightsURI) external {
		require(_isAuthorized(_ownerOf(tokenId), msg.sender, tokenId), "Not authorized");
		_weightsURI[tokenId] = weightsURI;
		emit BrainUpdated(tokenId, weightsURI);
	}

	function weightsURI(uint256 tokenId) external view returns (string memory) {
		return _weightsURI[tokenId];
	}
}


