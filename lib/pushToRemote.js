const gitP = require('simple-git/promise')
const Ora = require('ora')

const constants = require('./constants')

module.exports = function(distBranchName, remoteName, remoteUrl) {
    const spinner = new Ora()
    const git = gitP(constants.tmpPackageDir)
    spinner.info(`Initializing Git in temp directory (${constants.tmpPackageDir})`)
    spinner.indent = 2
    spinner.start('Git init')
    return git
        .silent(true)
        .init()
        .then(() => spinner.succeed())
        .then(() => git.addRemote(remoteName, remoteUrl))
        .then(() => spinner.start(`Checking out branch "${distBranchName}"`))
        .then(() => git.checkoutLocalBranch(distBranchName))
        .then(() => git.fetch(remoteName, distBranchName).then(() => git.pull(remoteName, distBranchName)))
        .then(() => spinner.succeed())
        .then(() => spinner.start(`Adding files to stage`))
        .then(() => git.add(['.']))
        .then(() => spinner.succeed())
        .then(() => spinner.start(`Committing changes`))
        .then(() => git.commit('bundle update'))
        .then(() => spinner.succeed())
        .then(() => spinner.start(`Pushing to ${remoteName}/${distBranchName}`))
        .then(() => git.push([remoteName, distBranchName]))
        .then(() => spinner.succeed())
        .catch(err => {
            spinner.fail()
            throw err
        })
}
