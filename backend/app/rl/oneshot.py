from __future__ import annotations

from typing import List


def one_shot_counter_strategy(opponent_history: List[int]) -> List[float]:
	"""
	Given opponent history, return a quick counter distribution over our 3 actions.
	- If a new/unseen action dominates recently, bias to its counter.
	"""
	if not opponent_history:
		return [1/3, 1/3, 1/3]
	recent = opponent_history[-5:]
	counts = [recent.count(0), recent.count(1), recent.count(2)]
	# Counter mapping: 0<-1, 1<-2, 2<-0
	counter = {0: 1, 1: 2, 2: 0}
	best = max(range(3), key=lambda a: counts[a])
	biased = [0.15, 0.15, 0.15]
	biased[counter[best]] = 0.55
	return biased


