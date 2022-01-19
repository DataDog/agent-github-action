import {exec} from '@actions/exec'

export async function pullImage(imageName: string): Promise<number> {
  return exec('docker', ['pull', imageName])
}

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
    '-v',
    '/var/run/docker.sock:/var/run/docker.sock:ro',
    '-v',
    '/sys/fs/cgroup/:/host/sys/fs/cgroup:ro',
    '-e',
    `DD_API_KEY=${apiKey}`,
    '-e',
    'DD_INSIDE_CI=true',
    '-e',
    'DD_HOSTNAME=none',
    '-e',
    `DD_SITE=${site}`,
    '-p',
    '8126:8126',
    imageName
  ])
}

export async function getAgentHealth(containerName: string): Promise<number> {
  return exec('docker', ['exec', '-t', containerName, 'agent', 'check', 'health'], {ignoreReturnCode: true})
}
