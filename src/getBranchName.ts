import * as gitP from 'simple-git/promise'
import {MODULE_DIR} from './constants'
import {logger} from './logger'

const moduleGit = gitP(MODULE_DIR)

export function getBranchName() {
    logger.verbose('Getting branch name')
    return moduleGit
        .branchLocal()
        .then(branchSummary => branchSummary.current)
        .then(branchName => {
            logger.info(`Branch name: ${branchName}-dist`)
            return branchName + '-dist'
        })
}
