const gitP = require('simple-git/promise')
const Ora = require('ora')

const constants = require('./constants')

module.exports = function(distBranchName, remoteName, REMOTE_URL) {
    const spinner = new Ora()
    const git = gitP(constants.tmpPackageDir)
    spinner.info(`Initializing Git in temp directory (${constants.tmpPackageDir})`)
    spinner.indent = 2
    spinner.start('Git init')
    return git
        .silent(true)
        .init()
        .then(() => spinner.succeed())
        .then(() => spinner.start(`Checking out local branch "${distBranchName}"`))
        .then(() => git.checkoutLocalBranch(distBranchName))
        .then(() => spinner.succeed())
        .then(() => spinner.start(`Adding files to stage`))
        .then(() => git.add(['.']))
        .then(() => spinner.succeed())
        .then(() => spinner.start(`Committing changes`))
        .then(() => git.commit('bundle update'))
        .then(() => spinner.succeed())
        .then(() => git.addRemote(remoteName, REMOTE_URL))
        .then(() => spinner.start(`Pushing to ${remoteName}/${distBranchName}`))
        .then(() => git.push(['--force', remoteName, distBranchName]))
        .then(() => spinner.succeed())
        .catch(err => {
            spinner.fail()
            throw err
        })
}
