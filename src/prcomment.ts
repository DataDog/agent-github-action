import * as core from '@actions/core'
import * as github from '@actions/github'

export async function comment_pr(token: string, site: string): Promise<void> {
  const context = github.context
  if (!context.payload.pull_request) {
    core.debug('skipping pr comment - not related to a pr')
    return
  }

  const run_attempt = process.env['GITHUB_RUN_ATTEMPT']
  let pipeline_url = `${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`
  if (run_attempt) {
    pipeline_url += `/${run_attempt}`
  }

  const query_params = [
    `@commit:${context.sha}`,
    `@repository.id:${context.serverUrl.replace(/^https?:\/\//, '')}/${context.repo.owner}/${context.repo.repo}`,
    `@ci.pipeline.url:${pipeline_url}`
  ]

  const datadog_url = `https://${site}/ci/test-runs?query=${encodeURIComponent(query_params.join(' '))}`
  const client = github.getOctokit(token)
  client.rest.issues.createComment({
    ...github.context.repo,
    issue_number: context.payload.pull_request.number,
    body: `Link to tests in [DataDog](${datadog_url})`
  })
}
