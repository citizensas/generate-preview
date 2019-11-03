import * as rimraf from 'rimraf'
import {logger} from './logger'

export function cleanup(pathsToRemove: string[]) {
    logger.info('Cleaning up')
    const promises: Array<Promise<void>> = []
    pathsToRemove.forEach(path => {
        logger.verbose(`Removing ${path}`)
        promises.push(
            new Promise((resolve, reject) => {
                rimraf(path, err => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                })
            })
        )
    })
    return Promise.all(promises)
}
