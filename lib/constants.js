const path = require('path')
const tempy = require('tempy')

const moduleDir = process.cwd()
const tmpDir = tempy.directory()

module.exports = {
    moduleDir: moduleDir,
    packageJson: require(path.join(moduleDir, 'package.json')),
    tmpDir: tmpDir,
    tmpPackageDir: path.join(tmpDir, 'package')
}
