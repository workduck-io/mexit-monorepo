const fs = require('fs')
const spawn = require('spawndamnit')

const runChangesetVersion = async () => {
  const child = spawn('yarn', ['changeset', 'version'])

  child.on('stdout', (data) => console.log(data.toString()))
  child.on('stderr', (data) => console.error(data.toString()))

  await child
}

const runPrettierManifest = async () => {
  const child = spawn('yarn', ['prettier', '--write', 'apps/extension/src/manifest.json'])

  child.on('stdout', (data) => console.log(data.toString()))
  child.on('stderr', (data) => console.error(data.toString()))

  await child
}

const main = async () => {
  await runChangesetVersion()

  const updatedExtensionPackageJSON = JSON.parse(fs.readFileSync('apps/extension/package.json', 'utf-8'))
  const updatedExtensionVersion = updatedExtensionPackageJSON.version

  const manifestData = JSON.parse(fs.readFileSync('apps/extension/src/manifest.json', 'utf-8'))

  manifestData['version'] = updatedExtensionVersion

  fs.writeFileSync('apps/extension/src/manifest.json', JSON.stringify(manifestData))

  await runPrettierManifest()
}

main()
