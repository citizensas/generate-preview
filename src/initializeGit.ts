import * as fs from 'fs'
import * as gitP from 'simple-git/promise'
import {TMP_PACKAGE_DIR} from './constants'
import {getFlags} from './cliFlags'
import {logger} from './logger'

function createTempDirectory(dir: string) {
    return new Promise<void>((resolve, reject) => {
        fs.mkdir(dir, {recursive: true}, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

export function initializeGit(distBranchName: string, remoteUrl: string) {
    const {remoteName} = getFlags()
    logger.verbose(`Creating temp directory`)
    return createTempDirectory(TMP_PACKAGE_DIR).then(() => {
        const git = gitP(TMP_PACKAGE_DIR)
        logger.verbose(`Initializing Git in temp directory (${TMP_PACKAGE_DIR})`)
        logger.verbose('Git init')
        return git
            .silent(true)
            .init()
            .then(() => logger.verbose(`Checking out branch "${distBranchName}"`))
            .then(() => git.addRemote(remoteName, remoteUrl))
            .then(() =>
                git
                    .fetch(remoteName, distBranchName)
                    .then(() => {
                        logger.verbose('Fetching existing branch')
                        return git
                            .checkout(`${remoteName}/${distBranchName}`)
                            .then(() => logger.verbose('Prepare for staging'))
                            .then(() => git.raw(['rm', '.', '-r']))
                    })
                    .catch(() => {})
            )
            .then(() => git.checkoutLocalBranch(distBranchName))
    })
}
