import * as gitP from 'simple-git/promise'
import {MODULE_DIR} from './constants'
import {logger} from './logger'
import {getFlags} from './cliFlags'

const moduleGit = gitP(MODULE_DIR)

export function getBranchName() {
    const {branchName} = getFlags()
    logger.verbose('Getting branch name')
    if (branchName) {
        logger.info(`Branch name: ${branchName}`)
        return Promise.resolve(branchName)
    }
    return moduleGit
        .branchLocal()
        .then(branchSummary => branchSummary.current)
        .then(branchName => {
            logger.info(`Branch name: ${branchName}-dist`)
            return branchName + '-dist'
        })
}
