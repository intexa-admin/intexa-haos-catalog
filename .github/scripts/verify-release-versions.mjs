import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const expected = process.env.BUILD_VERSION
if (!expected || !/^\d+\.\d+\.\d+$/.test(expected)) {
  throw new Error('BUILD_VERSION must be an exact semantic version.')
}

const readManifestVersion = async path => {
  const manifest = await readFile(path, 'utf8')
  const version = /^version:\s*([^\s#]+)\s*$/m.exec(manifest)?.[1]
  if (!version) throw new Error(`Missing version in ${path}.`)
  return version
}

const distribution = JSON.parse(await readFile('distribution.json', 'utf8'))
const versions = {
  catalog: await readManifestVersion('home_controller/config.yaml'),
  distribution: distribution.version,
  packagedManifest: await readManifestVersion('source/home-assistant-app/home-controller/config.yaml'),
  buildVersion: expected,
}

for (const [name, version] of Object.entries(versions)) {
  if (version !== expected) {
    throw new Error(`${name} version ${String(version)} does not match ${expected}.`)
  }
}

const assetsDirectory = 'source/home-assistant-app/home-controller/artifacts/installer/assets'
const assets = (await readdir(assetsDirectory)).filter(name => name.endsWith('.js'))
if (assets.length === 0) throw new Error('Installer JavaScript bundle is missing.')

const quotedVersion = new RegExp(`(?:[\\"'\\x60])${expected.replaceAll('.', '\\.')}[\\"'\\x60]`)
let installerVersionFound = false
for (const asset of assets) {
  if (quotedVersion.test(await readFile(join(assetsDirectory, asset), 'utf8'))) {
    installerVersionFound = true
    break
  }
}
if (!installerVersionFound) {
  throw new Error(`Compiled Installer does not contain app version ${expected}.`)
}

console.log(`Release versions are coherent: ${expected}.`)
