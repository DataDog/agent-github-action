import * as core from '@actions/core'
import {getAgentHealth, startAgent} from './start'

async function run(): Promise<void> {
  try {
    const imageName: string = core.getInput('image_name', {required: true})
    const containerName: string = core.getInput('container_name', {required: true})
    const apiKey: string = core.getInput('api_key', {required: true})
    const site: string = core.getInput('datadog_site', {required: true})

    core.info('Starting agent')
    let code = await startAgent(imageName, containerName, apiKey, site)
    if (code !== 0) throw new Error(`could not start agent: (${code})`)

    code = 1
    let attempts = 0
    while (code !== 0 && attempts < 10) {
      attempts++
      core.info('checking agent health')
      code = await getAgentHealth(containerName)
      if (code !== 0) {
        core.info(`the agent is not ready waiting ${5 * attempts} seconds`)
        await new Promise(f => setTimeout(f, 5000 * attempts))
      }
    }

    if (code !== 0) throw new Error(`could not start agent: (${code})`)

    core.info('Agent started')
    
    core.exportVariable('DD_ENV', 'ci')
    core.exportVariable('DD_SERVICE', process.env.GITHUB_REPOSITORY)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
