import * as fs from 'fs'
import * as gitP from 'simple-git/promise'
import * as ora from 'ora'
import {TMP_PACKAGE_DIR} from './constants'
import {getFlags} from './cliFlags'

function createTempDirectory(dir: string) {
    return new Promise<void>((resolve, reject) => {
        fs.mkdir(dir, {recursive: true}, err => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

export function initializeGit(distBranchName: string, remoteUrl: string) {
    const {remoteName, verbose} = getFlags()
    const spinner = ora()
    verbose && spinner.start(`Creating temp directory`)
    return createTempDirectory(TMP_PACKAGE_DIR).then(() => {
        const git = gitP(TMP_PACKAGE_DIR)
        verbose && spinner.info(`Initializing Git in temp directory (${TMP_PACKAGE_DIR})`)
        verbose && spinner.start('Git init')
        return git
            .silent(true)
            .init()
            .then(() => verbose && spinner.start(`Checking out branch "${distBranchName}"`))
            .then(() => git.addRemote(remoteName, remoteUrl))
            .then(() =>
                git
                    .fetch(remoteName, distBranchName)
                    .then(() => {
                        verbose && spinner.start('Fetching existing branch')
                        return git
                            .checkout(`${remoteName}/${distBranchName}`)
                            .then(() => verbose && spinner.start('Prepare for staging'))
                            .then(() => git.raw(['rm', '.', '-r']))
                            .then(() => verbose && spinner.succeed())
                    })
                    .catch(() => {})
            )
            .then(() => git.checkoutLocalBranch(distBranchName))
            .then(() => verbose && spinner.succeed())
            .catch(err => {
                verbose && spinner.fail()
                throw err
            })
    })
}
