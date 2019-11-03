import * as gitP from 'simple-git/promise'
import {TMP_PACKAGE_DIR} from './constants'
import {getFlags} from './cliFlags'
import {logger} from './logger'

export function pushToRemote(distBranchName: string) {
    const {remoteName} = getFlags()
    const git = gitP(TMP_PACKAGE_DIR)
    logger.verbose(`Adding files to stage`)
    return git
        .silent(true)
        .add(['.'])
        .then(() => logger.verbose(`Committing changes`))
        .then(() => git.commit('bundle update'))
        .then(() => logger.verbose(`Pushing to ${remoteName}/${distBranchName}`))
        .then(() => git.push(remoteName, distBranchName))
}
