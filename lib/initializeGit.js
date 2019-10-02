const gitP = require('simple-git/promise')
const GitUrlParse = require('git-url-parse')
const Ora = require('ora')

const constants = require('./constants')
const moduleGit = gitP(constants.moduleDir)

module.exports = function(distBranchName, remoteName, remoteUrl) {
    const spinner = new Ora()
    const git = gitP(constants.tmpPackageDir)
    spinner.info(`Initializing Git in temp directory (${constants.tmpPackageDir})`)
    spinner.indent = 2
    spinner.start('Git init')
    return git
        .silent(true)
        .init()
        .catch(err => {
            spinner.fail()
            throw err
        })
}
