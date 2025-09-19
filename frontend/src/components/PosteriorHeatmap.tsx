import React from 'react'

type Props = { posterior?: number[] }

export function PosteriorHeatmap({ posterior }: Props) {
	const p = posterior ?? [1/3, 1/3, 1/3]
	const labels = ['Strike', 'Block', 'Dash']
	return (
		<div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
			{p.map((v, i) => (
				<div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<div style={{ width: 60, height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
						<div style={{ width: `${Math.round(v*100)}%`, height: '100%', background: '#34d399' }} />
					</div>
					<div style={{ color: '#9ca3af', fontSize: 11 }}>{labels[i]} {Math.round(v*100)}%</div>
				</div>
			))}
		</div>
	)
}


