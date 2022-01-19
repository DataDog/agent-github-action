import * as core from '@actions/core'
import {pullImage, startAgent} from './start'

async function run(): Promise<void> {
  try {
    const imageName: string = core.getInput('imageName', {required: true})
    core.info(`Pulling docker image '${imageName}'`)
    let code = await pullImage(imageName)
    if (code !== 0) throw new Error(`could not pull agent image: (${code})`)

    const containerName: string = core.getInput('containerName', {required: true})
    const apiKey: string = core.getInput('apiKey', {required: true})
    const site: string = core.getInput('site', {required: true})

    core.info('Starting agent')
    code = await startAgent(imageName, containerName, apiKey, site)
    if (code !== 0) throw new Error(`could not start agent: (${code})`)
    core.info('Agent started')
    // TODO wait until agent has started
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
