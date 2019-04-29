const tar = require('tar')
const Ora = require('ora')

const constants = require('./constants')

module.exports = function(packedFilename) {
    const spinner = new Ora()
    spinner.start(`Unpacking ${packedFilename} into ${constants.tmpDir}`)
    return tar
        .x({
            file: packedFilename,
            cwd: constants.tmpDir
        })
        .then(
            result => {
                spinner.succeed(`Package "${constants.packageJson.name}" unpacked in ${constants.tmpPackageDir}`)
                return result
            },
            err => {
                spinner.fail(err)
                throw err
            }
        )
}
