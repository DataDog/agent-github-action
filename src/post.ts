import * as core from '@actions/core'
import {stopAgent} from './stop'

async function run(): Promise<void> {
  try {
    const containerName: string = core.getInput('containerName', {required: true})
    core.info('Stopping agent')
    await stopAgent(containerName)
    core.info('Agent stopped')
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
