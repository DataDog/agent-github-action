import * as core from '@actions/core'
import {comment_pr} from './prcomment'
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

  const github_token: string = core.getInput('GITHUB_TOKEN', {required: false})
  const site: string = core.getInput('datadog_site', {required: true})
  if (github_token) {
    try {
      comment_pr(github_token, site)
    } catch (error) {
      if (error instanceof Error) core.setFailed(error.message)
    }
  }
}

run()
