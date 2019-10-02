const gitP = require('simple-git/promise')
const GitUrlParse = require('git-url-parse')
const Ora = require('ora')

const constants = require('./constants')
const moduleGit = gitP(constants.moduleDir)

module.exports = function(remoteName, protocol) {
    const spinner = new Ora()
    spinner.start('Getting remote url')
    return moduleGit
        .getRemotes(true)
        .then(
            remotes =>
                new Promise((resolve, reject) => {
                    const remoteFound = remotes.some(remote => {
                        if (remote.name === remoteName) {
                            resolve(remote)
                            return true
                        }
                        return false
                    })
                    if (!remoteFound) {
                        reject(`Remote "${remoteName}" not found.`)
                    }
                })
        )
        .then(remote => {
            const remoteUrl = GitUrlParse(remote.refs.fetch).toString(protocol)
            spinner.succeed(`Remote URL for ${remoteName} is ${remoteUrl}`)
            return remoteUrl
        })
        .catch(err => {
            spinner.fail(err)
        })
}
