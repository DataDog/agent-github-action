import * as core from '@actions/core'
import {getAgentHealth, pullImage, startAgent} from './start'

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

    code = 1
    let attempts = 0;
    while (code !== 0 && attempts < 10) {
      core.info('checking agent health')
      code = await getAgentHealth(containerName)
      if (code !== 0) await new Promise(f => setTimeout(f, 1000 * attempts + 1))
    }

    core.info('Agent started')
    // TODO wait until agent has started
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
