import {exec} from '@actions/exec'

export async function startAgent(
  imageName: string,
  containerName: string,
  apiKey: string,
  site: string
): Promise<number> {
  return exec('docker', [
    'run',
    '-d',
    '--name',
    containerName,
    '-e',
    `DD_API_KEY=${apiKey}`,
    '-e',
    'DD_INSIDE_CI=true',
    '-e',
    'DD_HOSTNAME=none',
    '-e',
    `DD_SITE=${site}`,
    '-e',
    'DD_DOGSTATSD_NON_LOCAL_TRAFFIC=true',
    '-p',
    '8125:8125/udp',
    '-p',
    '8126:8126/tcp',
    imageName
  ])
}

export async function getAgentHealth(containerName: string): Promise<number> {
  return exec('docker', ['exec', '-t', containerName, 'agent', 'health'], {ignoreReturnCode: true})
}
