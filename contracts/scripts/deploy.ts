import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import { ethers, artifacts } from 'hardhat'

async function main() {
    const Fighter = await ethers.getContractFactory('FighterBrain')
    const fighter = await Fighter.deploy()
    await fighter.waitForDeployment()

    const Logger = await ethers.getContractFactory('BattleLogger')
    const logger = await Logger.deploy()
    await logger.waitForDeployment()

	const outDir = path.join(__dirname, '../../frontend/src/contracts')
	mkdirSync(outDir, { recursive: true })
    const addresses = {
        FighterBrain: await fighter.getAddress(),
        BattleLogger: await logger.getAddress(),
    }
	writeFileSync(path.join(outDir, 'addresses.json'), JSON.stringify(addresses, null, 2))

	// Write ABIs
	const fighterArtifact = await artifacts.readArtifact('FighterBrain')
	const loggerArtifact = await artifacts.readArtifact('BattleLogger')
	writeFileSync(path.join(outDir, 'FighterBrain.json'), JSON.stringify(fighterArtifact.abi, null, 2))
	writeFileSync(path.join(outDir, 'BattleLogger.json'), JSON.stringify(loggerArtifact.abi, null, 2))

	console.log('Deployed:', addresses)
}

main().catch((e) => {
	console.error(e)
	process.exit(1)
})


