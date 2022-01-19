import {exec} from '@actions/exec'

export async function stopAgent(containerName: string): Promise<number> {
  return exec('docker', ['exec', '-t', containerName, 'agent', 'stop'])
}
