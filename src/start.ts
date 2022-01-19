import {spawn} from 'child_process'

export async function pullImage(imageName: string): Promise<number> {
  return new Promise(resolve => {
    const child = spawn('docker', ['pull', imageName], {stdio: 'pipe'})

    child.on('close', code => {
      if (code !== 0) {
        throw new Error(`Could not pull docker image exit code ${code}`)
      }

      resolve(code)
    })

    child.on('error', err => {
      throw new Error(`Could not pull docker image: ${err.message}`)
    })
  })
}

export async function startAgent(
  imageName: string,
  containerName: string,
  apiKey: string,
  site: string
): Promise<number> {
  return new Promise(resolve => {
    const child = spawn(
      'docker',
      [
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
      ],
      {stdio: 'pipe'}
    )

    child.on('close', code => {
      if (code !== 0) {
        throw new Error(`Could not run docker datadog agent, exit code ${code}`)
      }

      resolve(code)
    })

    child.on('error', err => {
      throw new Error(`Could not run docker datadog agent image: ${err.message}`)
    })
  })
}
