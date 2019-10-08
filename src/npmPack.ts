import * as child_process from 'child_process'
import * as ora from 'ora'
import {MODULE_DIR, PACKAGE_JSON} from './constants'
import {getFlags} from './cliFlags'

export function npmPack() {
    const {verbose} = getFlags()
    const spinner = ora()
    verbose && spinner.start(`Packing ${PACKAGE_JSON.name}`)
    return new Promise<string>((resolve, reject) =>
        child_process.exec(`npm pack | tail -1`, {cwd: MODULE_DIR}, function(err, stdout) {
            if (err) {
                verbose && spinner.fail(err.toString())
                reject(err)
            } else {
                const filename = stdout.trim()
                verbose && spinner.succeed(`Packed into ${filename}`)
                resolve(filename)
            }
        })
    )
}
