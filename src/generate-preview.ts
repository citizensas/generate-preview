import {MODULE_DIR, TMP_DIR} from './constants'

import * as path from 'path'
import * as fs from 'fs'

import {getBranchName} from './getBranchName'
import {getRemoteUrl} from './getRemoteUrl'
import {npmPack} from './npmPack'
import {initializeGit} from './initializeGit'
import {unpack} from './unpack'
import {pushToRemote} from './pushToRemote'
import {cleanup} from './cleanup'
import {IFlags, setFlags} from './cliFlags'
import {logger} from './logger'

const logFileName = 'generate-preview.log'

const writeIntoLogFile = (content: string) => {
    const path = logFileName
    return new Promise((resolve, reject) => {
        fs.open(path, 'w+', function(err) {
            if (err) {
                reject(err)
            } else {
                fs.writeFile(path, content, function(err) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                })
            }
        })
    })
}

export function generatePreview(flags: IFlags) {
    setFlags(flags)
    Promise.all([getBranchName(), getRemoteUrl(), npmPack()])
        .then(([distBranchName, remoteUrl, packedFilename]) => {
            const packedFilePath = path.join(MODULE_DIR, packedFilename)
            return initializeGit(distBranchName, remoteUrl)
                .then(() => unpack(packedFilename))
                .then(() => pushToRemote(distBranchName))
                .then(() => {
                    return {
                        pathsToRemove: [TMP_DIR, packedFilePath],
                        remoteUrl: remoteUrl,
                        distBranchName: distBranchName
                    }
                })
                .catch((err: unknown) =>
                    cleanup([TMP_DIR, packedFilePath]).then(() => {
                        throw err
                    })
                )
        })
        .then(res =>
            cleanup(res.pathsToRemove).then(() => {
                logger.info(
                    `Now you can install generated URL in you module using Yarn or NPM. Just run the following command.`
                )
                const version = `${res.remoteUrl}#${res.distBranchName}`
                console.log(`npm install ${version}`)
                console.log(' OR ')
                console.log(`yarn add ${version}`)
                if (flags.logFinalVersion) {
                    console.log(`Logging the final version into ${logFileName}...`)
                    return writeIntoLogFile(version)
                }
            })
        )
        .catch(err => {
            logger.error(err)
            process.exit(1)
        })
}
