import * as gitP from 'simple-git/promise'
import * as ora from 'ora'
import {TMP_PACKAGE_DIR} from './constants'
import {getFlags} from './cliFlags'

export function pushToRemote(distBranchName: string) {
    const {remoteName, verbose} = getFlags()
    const spinner = ora()
    const git = gitP(TMP_PACKAGE_DIR)
    verbose && spinner.start(`Adding files to stage`)
    return git
        .silent(true)
        .add(['.'])
        .then(() => verbose && spinner.succeed())
        .then(() => verbose && spinner.start(`Committing changes`))
        .then(() => git.commit('bundle update'))
        .then(() => verbose && spinner.succeed())
        .then(() => verbose && spinner.start(`Pushing to ${remoteName}/${distBranchName}`))
        .then(() => git.push(remoteName, distBranchName))
        .then(() => verbose && spinner.succeed())
        .catch((err: unknown) => {
            verbose && spinner.fail()
            throw err
        })
}
