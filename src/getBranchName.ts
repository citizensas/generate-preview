import * as gitP from 'simple-git/promise'
import * as ora from 'ora'
import {MODULE_DIR} from './constants'
import {getFlags} from './cliFlags'

const moduleGit = gitP(MODULE_DIR)

export function getBranchName() {
    const {verbose} = getFlags()
    const spinner = ora()
    verbose && spinner.start('Getting branch name')
    return moduleGit
        .branchLocal()
        .then(branchSummary => branchSummary.current)
        .then(branchName => {
            verbose && spinner.succeed(`Branch name: ${branchName}-dist`)
            return branchName + '-dist'
        })
        .catch(err => {
            verbose && spinner.fail(err)
            throw err
        })
}
