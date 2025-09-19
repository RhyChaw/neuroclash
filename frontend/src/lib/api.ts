export type SimStep = { step: number; player_action: number; opponent_action: number; reward: number }
export type SimResponse = { steps: SimStep[]; total_reward: number }

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export async function simulate(max_steps = 30): Promise<SimResponse> {
	const r = await fetch(`${API_URL}/simulate`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ opponent_history: [], max_steps })
	})
	return r.json()
}


