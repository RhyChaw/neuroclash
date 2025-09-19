from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from .rl import SimpleArenaEnv, BayesianOpponentModel, CategoricalPolicy, one_shot_counter_strategy


class SimulateRequest(BaseModel):
	opponent_history: List[int] = []
	seed: Optional[int] = None
	max_steps: int = 60


class SimulateStep(BaseModel):
	step: int
	player_action: int
	opponent_action: int
	reward: float
	posterior: List[float]
	policy: List[float]


class SimulateResponse(BaseModel):
	steps: List[SimulateStep]
	total_reward: float


app = FastAPI(title="EvoArena API")

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


@app.get("/health")
def health():
	return {"status": "ok"}


@app.post("/simulate", response_model=SimulateResponse)
def simulate(req: SimulateRequest):
	# Meta-adaptive toy loop: Bayes update over opponent, one-shot biasing, simple env
	env = SimpleArenaEnv(max_steps=req.max_steps, seed=req.seed)
	opp_model = BayesianOpponentModel.new(prior=1.0)
	policy = CategoricalPolicy(probs=[1/3, 1/3, 1/3], seed=req.seed)
	opponent_history: List[int] = list(req.opponent_history)

	env.reset()
	steps: List[SimulateStep] = []
	total = 0.0
	for i in range(req.max_steps):
		# Update posterior and derive counter-bias
		if opponent_history:
			opp_model.update(opponent_history[-1])
		posterior = opp_model.posterior_mean()
		bias = one_shot_counter_strategy(opponent_history)
		# Blend: 70% posterior-informed counter, 30% exploration uniform
		uniform = [1/3, 1/3, 1/3]
		blended = [0.7 * b + 0.3 * u for b, u in zip(bias, uniform)]
		policy.probs = blended

		player_action = policy.sample()
		# Simple synthetic opponent: sample from current posterior as proxy
		# Convert posterior to a categorical sample
		from random import random
		acc = 0.0
		r = random()
		opponent_action = 2
		for idx, p in enumerate(posterior):
			acc += p
			if r <= acc:
				opponent_action = idx
				break
		opponent_history.append(opponent_action)

		state, reward, done, _ = env.step(player_action, opponent_action)
		total += reward
		steps.append(
			SimulateStep(
				step=i,
				player_action=player_action,
				opponent_action=opponent_action,
				reward=reward,
				posterior=posterior,
				policy=blended,
			)
		)
		if done:
			break

	return SimulateResponse(steps=steps, total_reward=total)


