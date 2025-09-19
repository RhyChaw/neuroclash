import { useEffect, useState } from 'react'
import addresses from '../contracts/addresses.json'
import FighterBrainAbi from '../contracts/FighterBrain.json'
import { ethers } from 'ethers'

export function WalletPanel() {
	const [account, setAccount] = useState<string | null>(null)
	const [status, setStatus] = useState<string>('')

	async function connect() {
		if (!(window as any).ethereum) {
			setStatus('No wallet found')
			return
		}
		const provider = new ethers.BrowserProvider((window as any).ethereum)
		await provider.send('eth_requestAccounts', [])
		const signer = await provider.getSigner()
		setAccount(await signer.getAddress())
	}

	async function mint() {
		try {
			if (!(window as any).ethereum) return
			const provider = new ethers.BrowserProvider((window as any).ethereum)
			const signer = await provider.getSigner()
			const contract = new ethers.Contract(addresses.FighterBrain, FighterBrainAbi as any, signer)
			const tx = await contract.mintSelf('data:application/json;base64,')
			setStatus('Minting... ' + tx.hash)
			await tx.wait()
			setStatus('Minted!')
		} catch (e: any) {
			setStatus('Error: ' + (e?.message || e))
		}
	}

	useEffect(() => {
		connect().catch(() => {})
	}, [])

	return (
		<div style={{ position: 'fixed', right: 16, top: 16, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', padding: 12, borderRadius: 8 }}>
			<div style={{ fontWeight: 700, marginBottom: 6 }}>Wallet</div>
			<div style={{ fontSize: 12, opacity: 0.8 }}>{account ? account.slice(0,6)+'…'+account.slice(-4) : 'Not connected'}</div>
			<div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
				<button onClick={connect}>Connect</button>
				<button onClick={mint}>Mint Fighter</button>
			</div>
			{status && <div style={{ fontSize: 12, marginTop: 6, opacity: 0.9 }}>{status}</div>}
		</div>
	)
}


