import * as core from '@actions/core'
import {stopAgent} from './stop'

async function run(): Promise<void> {
  try {
    const containerName: string = core.getInput('container_name', {required: true})
    core.info('Stopping agent')
    const code = await stopAgent(containerName)
    if (code !== 0) throw new Error(`could not stop agent (${code})`)
    core.info('Agent stopped')
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
