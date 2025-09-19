from __future__ import annotations

from dataclasses import dataclass
import random
from typing import List


@dataclass
class CategoricalPolicy:
	probs: List[float]  # length 3, sums to 1
	seed: int | None = None

	def __post_init__(self):
		self._rng = random.Random(self.seed)

	def sample(self) -> int:
		threshold = self._rng.random()
		cum = 0.0
		for i, p in enumerate(self.probs):
			cum += p
			if threshold <= cum:
				return i
		return len(self.probs) - 1

	def update_dirichlet(self, counts: List[float], alpha: float = 0.1) -> None:
		total = sum(counts) + alpha * len(counts)
		self.probs = [(c + alpha) / total for c in counts]


