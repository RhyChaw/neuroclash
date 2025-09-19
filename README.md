# NeuroClash – Adaptive Meta-AI Combatants

Monorepo with frontend (Three.js), backend (FastAPI + PyTorch stubs), and contracts (Hardhat + OpenZeppelin).

## Prereqs
- Node.js 18+
- Python 3.10+
- macOS: run `sudo xcodebuild -license` once if prompted during builds.

## Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Frontend
```bash
cd frontend
npm i
npm run dev
```

## Contracts
```bash
cd contracts
npm i
npm run build
```

Open `http://localhost:5173` and ensure the backend is on `http://127.0.0.1:8000`.
