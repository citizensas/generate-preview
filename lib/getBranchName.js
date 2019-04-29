const gitP = require('simple-git/promise')
const Ora = require('ora')

const constants = require('./constants')

const moduleGit = gitP(constants.moduleDir)

module.exports = function() {
    const spinner = new Ora()
    spinner.start('Getting branch name')
    return moduleGit
        .branchLocal()
        .then(branchSummary => branchSummary.current)
        .then(branchName => {
            spinner.succeed(`Branch name: ${branchName}-dist`)
            return branchName + '-dist'
        })
        .catch(err => {
            spinner.fail(err)
            throw err
        })
}
