import * as gitP from 'simple-git/promise'
import * as GitUrlParse from 'git-url-parse'
import {MODULE_DIR} from './constants'
import {RemoteWithRefs} from 'simple-git/typings/response'
import {getFlags} from './cliFlags'
import {logger} from './logger'

export function getRemoteUrl() {
    const {remoteName, protocol} = getFlags()
    const moduleGit = gitP(MODULE_DIR)
    logger.verbose('Getting remote url')
    return moduleGit
        .getRemotes(true)
        .then(
            remotes =>
                new Promise<RemoteWithRefs>((resolve, reject) => {
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
            logger.verbose(`Remote URL for ${remoteName} is ${remoteUrl}`)
            return remoteUrl
        })
}
