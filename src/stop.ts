import {spawn} from 'child_process'

export async function stopAgent(containerName: string): Promise<number> {
  return new Promise(resolve => {
    const child = spawn('docker', ['exec', '-t', containerName, 'agent', 'stop'], {stdio: 'pipe'})

    child.on('close', code => {
      if (code !== 0) {
        throw new Error(`Could not stop agent, exit code ${code}`)
      }

      resolve(code)
    })

    child.on('error', err => {
      throw new Error(`Could not stop agent: ${err.message}`)
    })
  })
}
