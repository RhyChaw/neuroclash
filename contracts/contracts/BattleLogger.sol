// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BattleLogger {
	event BattleRecorded(
		uint256 indexed fighterA,
		uint256 indexed fighterB,
		address indexed submitter,
		bytes32 battleHash,
		uint64 timestamp
	);

	function recordBattle(
		uint256 fighterA,
		uint256 fighterB,
		bytes32 battleHash
	) external {
		emit BattleRecorded(fighterA, fighterB, msg.sender, battleHash, uint64(block.timestamp));
	}
}


