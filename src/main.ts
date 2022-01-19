import * as core from '@actions/core'
import {pullImage, startAgent} from './start'

async function run(): Promise<void> {
  try {
    const imageName: string = core.getInput('imageName', {required: true})
    core.info(`Pulling docker image '${imageName}'`)
    await pullImage(imageName)

    const containerName: string = core.getInput('containerName', {required: true})
    const apiKey: string = core.getInput('apiKey', {required: true})
    const site: string = core.getInput('site', {required: true})

    core.info('Starting agent')
    await startAgent(imageName, containerName, apiKey, site)
    core.info('Agent started')
    // TODO wait until agent has started
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
