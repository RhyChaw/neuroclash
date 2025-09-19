from __future__ import annotations

from dataclasses import dataclass
from typing import Tuple, Dict
import random


Action = int  # 0 = strike, 1 = block, 2 = dash


@dataclass
class EnvState:
	step: int = 0
	player_hp: int = 10
	opponent_hp: int = 10


class SimpleArenaEnv:
	"""
	A tiny toy arena for rapid iteration:
	- Actions: 0 strike, 1 block, 2 dash
	- Reward: +1 when your action counters opponent (rock-paper-scissors style)
	- Episode ends at fixed horizon or when any HP reaches 0
	"""

	def __init__(self, max_steps: int = 60, seed: int | None = None):
		self.max_steps = max_steps
		self.random = random.Random(seed)
		self.state = EnvState()

	def reset(self) -> EnvState:
		self.state = EnvState()
		return self.state

	def step(self, player_action: Action, opponent_action: Action) -> Tuple[EnvState, float, bool, Dict]:
		self.state.step += 1
		reward = self._rps_reward(player_action, opponent_action)
		# Simple HP change: reward also converts to HP swing
		if reward > 0:
			self.state.opponent_hp -= 1
		elif reward < 0:
			self.state.player_hp -= 1

		done = self.state.step >= self.max_steps or self.state.player_hp <= 0 or self.state.opponent_hp <= 0
		info: Dict = {}
		return self.state, reward, done, info

	@staticmethod
	def _rps_reward(a: Action, b: Action) -> float:
		# 0 beats 2, 1 beats 0, 2 beats 1
		if a == b:
			return 0.0
		beats = {0: 2, 1: 0, 2: 1}
		return 1.0 if beats[a] == b else -1.0


