const path = require('path')
const Ora = require('ora')

const constants = require('./constants')
const getBranchName = require('./getBranchName')
const getRemoteUrl = require('./getRemoteUrl')
const npmPack = require('./npmPack')
const unpacking = require('./unpacking')
const pushToRemote = require('./pushToRemote')
const cleanup = require('./cleanup')

const spinner = new Ora()

module.exports = function({remoteName}) {
    Promise.all([getBranchName(), getRemoteUrl(remoteName), npmPack()])
        .then(([distBranchName, REMOTE_URL, packedFilename]) => {
            const packedFilePath = path.join(constants.moduleDir, packedFilename)
            return unpacking(packedFilename)
                .then(() => pushToRemote(distBranchName, remoteName, REMOTE_URL))
                .then(() => {
                    return {
                        pathsToRemove: [constants.tmpDir, packedFilePath],
                        remoteUrl: REMOTE_URL,
                        distBranchName: distBranchName
                    }
                })
                .catch(err =>
                    cleanup([constants.tmpDir, packedFilePath]).then(() => {
                        throw err
                    })
                )
        })
        .then(res => {
            cleanup(res.pathsToRemove).then(() => {
                spinner.info(
                    `Copy the URL and paste it as version number in your package.json for ${constants.packageJson.name}`
                )
                spinner.info(`git+ssh://${res.remoteUrl}#${res.distBranchName}`)
            })
        })
        .catch(err => {
            console.error(err)
            process.exit(1)
        })
}
