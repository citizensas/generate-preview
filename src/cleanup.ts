import * as ora from 'ora'
import * as rimraf from 'rimraf'
import {getFlags} from './cliFlags'

export function cleanup(pathsToRemove: string[]) {
    const {verbose} = getFlags()
    const spinner = ora()
    verbose && spinner.start('Cleaning up')
    const promises: Array<Promise<void>> = []
    const rimrafSpinner = ora()
    verbose && (rimrafSpinner.indent = 2)
    verbose && rimrafSpinner.start()
    pathsToRemove.forEach(path => {
        verbose && (rimrafSpinner.text = `Removing ${path}`)
        promises.push(
            new Promise((resolve, reject) => {
                rimraf(path, err => {
                    if (err) {
                        verbose && rimrafSpinner.fail(err.toString())
                        reject(err)
                    } else {
                        verbose && rimrafSpinner.stop()
                        verbose && rimrafSpinner.clear()
                        resolve()
                    }
                })
            })
        )
    })
    return Promise.all(promises).then(
        () => {
            verbose && spinner.succeed()
            return Promise.resolve()
        },
        err => {
            verbose && spinner.fail()
            throw err
        }
    )
}
