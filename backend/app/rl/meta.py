from __future__ import annotations

from dataclasses import dataclass
from typing import List


@dataclass
class BayesianOpponentModel:
	# Dirichlet posterior over opponent action distribution (3 actions)
	alpha: List[float]

	@classmethod
	def new(cls, prior: float = 1.0) -> "BayesianOpponentModel":
		return cls(alpha=[prior, prior, prior])

	def update(self, observed_action: int) -> None:
		self.alpha[observed_action] += 1.0

	def posterior_mean(self) -> List[float]:
		t = sum(self.alpha)
		return [a / t for a in self.alpha]


